'use server';

import { updateTag } from 'next/cache';
import { z } from 'zod';
import { verifyUser } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { moderateText } from '@/lib/moderation';
import { threadTags } from './thread-cache';
import { resolveRecipients, splitAddresses } from './thread-recipients';

export type ActionResult = { ok: true } | { ok: false; error: string };

const threadIdSchema = z.string().trim().min(1).max(100);
const threadIdsSchema = z.array(threadIdSchema).min(1).max(100);
const mailboxSchema = z.enum(['inbox', 'archive']);

function invalidAction(): ActionResult {
  return { error: 'That action is invalid.', ok: false };
}

function updateThreadState(userId: string, threadIds: string[]) {
  updateTag(threadTags.list(userId));
  for (const threadId of threadIds) updateTag(threadTags.state(userId, threadId));
}

export async function toggleStar(threadId: string, starred: boolean): Promise<ActionResult> {
  const user = await verifyUser();
  const parsed = z.object({ starred: z.boolean(), threadId: threadIdSchema }).safeParse({ starred, threadId });
  if (!parsed.success) return invalidAction();
  const state = await prisma.threadState.findUnique({
    where: { userId_threadId: { threadId: parsed.data.threadId, userId: user.id } },
  });
  if (!state) return { error: 'That conversation could not be found.', ok: false };

  await prisma.threadState.update({
    data: { starred: parsed.data.starred },
    where: { userId_threadId: { threadId: parsed.data.threadId, userId: user.id } },
  });
  updateThreadState(user.id, [parsed.data.threadId]);
  return { ok: true };
}

export async function moveThread(threadId: string, mailbox: 'inbox' | 'archive'): Promise<ActionResult> {
  const user = await verifyUser();
  const parsed = z.object({ mailbox: mailboxSchema, threadId: threadIdSchema }).safeParse({ mailbox, threadId });
  if (!parsed.success) return invalidAction();
  const state = await prisma.threadState.findUnique({
    where: { userId_threadId: { threadId: parsed.data.threadId, userId: user.id } },
  });
  if (!state) return { error: 'That conversation could not be found.', ok: false };

  await prisma.threadState.update({
    data: { mailbox: parsed.data.mailbox },
    where: { userId_threadId: { threadId: parsed.data.threadId, userId: user.id } },
  });
  updateThreadState(user.id, [parsed.data.threadId]);
  return { ok: true };
}

export async function moveThreads(threadIds: string[], mailbox: 'inbox' | 'archive'): Promise<ActionResult> {
  const user = await verifyUser();
  const parsed = z.object({ mailbox: mailboxSchema, threadIds: threadIdsSchema }).safeParse({ mailbox, threadIds });
  if (!parsed.success) return invalidAction();
  await prisma.threadState.updateMany({
    data: { mailbox: parsed.data.mailbox },
    where: { threadId: { in: parsed.data.threadIds }, userId: user.id },
  });
  updateThreadState(user.id, parsed.data.threadIds);
  return { ok: true };
}

export async function starThreads(threadIds: string[], starred: boolean): Promise<ActionResult> {
  const user = await verifyUser();
  const parsed = z.object({ starred: z.boolean(), threadIds: threadIdsSchema }).safeParse({ starred, threadIds });
  if (!parsed.success) return invalidAction();
  await prisma.threadState.updateMany({
    data: { starred: parsed.data.starred },
    where: { threadId: { in: parsed.data.threadIds }, userId: user.id },
  });
  updateThreadState(user.id, parsed.data.threadIds);
  return { ok: true };
}

export async function markThreadsRead(threadIds: string[], read: boolean): Promise<ActionResult> {
  const user = await verifyUser();
  const parsed = z.object({ read: z.boolean(), threadIds: threadIdsSchema }).safeParse({ read, threadIds });
  if (!parsed.success) return invalidAction();
  await prisma.threadState.updateMany({
    data: { read: parsed.data.read },
    where: { threadId: { in: parsed.data.threadIds }, userId: user.id },
  });
  updateThreadState(user.id, parsed.data.threadIds);
  return { ok: true };
}

export async function markThreadRead(threadId: string): Promise<ActionResult> {
  const user = await verifyUser();
  const parsed = threadIdSchema.safeParse(threadId);
  if (!parsed.success) return invalidAction();
  const { count } = await prisma.threadState.updateMany({
    data: { read: true },
    where: { read: false, threadId: parsed.data, userId: user.id },
  });
  if (count > 0) updateThreadState(user.id, [parsed.data]);
  return { ok: true };
}

export type ReplyResult = { ok: true; messageId: string } | { ok: false; error: string };

const replySchema = z.object({
  bcc: z.string().optional(),
  body: z.string().trim().min(1, 'Write a reply first.').max(4000, 'Keep replies under 4000 characters.'),
  cc: z.string().optional(),
  threadId: z.string().min(1),
});

export async function sendReply(formData: FormData): Promise<ReplyResult> {
  const user = await verifyUser();
  const parsed = replySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message, ok: false };
  const { body, threadId } = parsed.data;
  const problem = await moderateText(body);
  if (problem) return { error: problem, ok: false };

  const thread = await prisma.thread.findUnique({
    include: {
      messages: { include: { recipients: true }, orderBy: { sentAt: 'asc' } },
      states: { where: { userId: user.id } },
    },
    where: { id: threadId },
  });
  if (!thread || thread.states.length === 0) return { error: 'That conversation could not be found.', ok: false };

  const extra = await resolveRecipients(user.id, {
    bcc: splitAddresses(parsed.data.bcc),
    cc: splitAddresses(parsed.data.cc),
    to: [],
  });
  if (!extra.ok) return extra;

  const others = new Set<string>();
  for (const message of thread.messages) {
    others.add(message.fromId);
    for (const recipient of message.recipients) if (recipient.kind !== 'bcc') others.add(recipient.userId);
  }
  others.delete(user.id);
  for (const recipient of extra.recipients) others.delete(recipient.userId);
  const recipients = [
    ...[...others].map(userId => ({ kind: 'to', userId })),
    ...extra.recipients.map(recipient => ({ kind: recipient.kind, userId: recipient.userId })),
  ];
  const accounts = await prisma.user.findMany({
    select: { id: true },
    where: { account: true, id: { in: recipients.map(recipient => recipient.userId) } },
  });
  const sentAt = new Date();
  const messageId = `msg-${crypto.randomUUID().slice(0, 8)}`;

  await prisma.$transaction([
    prisma.message.create({
      data: {
        body,
        fromId: user.id,
        id: messageId,
        recipients: { create: recipients },
        sentAt,
        threadId,
      },
    }),
    prisma.thread.update({ data: { updatedAt: sentAt }, where: { id: threadId } }),
    prisma.threadState.update({ data: { read: true }, where: { userId_threadId: { threadId, userId: user.id } } }),
    ...accounts.map(account =>
      prisma.threadState.upsert({
        create: { mailbox: 'inbox', read: false, threadId, userId: account.id },
        update: { mailbox: 'inbox', read: false },
        where: { userId_threadId: { threadId, userId: account.id } },
      }),
    ),
  ]);

  updateTag(threadTags.detail(threadId));
  updateTag(threadTags.list(user.id));
  for (const account of accounts) updateTag(threadTags.list(account.id));
  return { messageId, ok: true };
}

export type ComposeResult = { ok: true; messageId: string } | { ok: false; error: string };

const composeSchema = z.object({
  bcc: z.string().optional(),
  body: z.string().trim().min(1, 'Write a message first.').max(4000, 'Keep messages under 4000 characters.'),
  cc: z.string().optional(),
  subject: z.string().trim().min(1, 'Add a subject.').max(120, 'Keep the subject under 120 characters.'),
  to: z.string().trim().min(1, 'Add at least one recipient.'),
});

export async function composeMessage(formData: FormData): Promise<ComposeResult> {
  const user = await verifyUser();
  const parsed = composeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message, ok: false };
  const { body, subject } = parsed.data;
  const problem = await moderateText(`${subject}\n\n${body}`);
  if (problem) return { error: problem, ok: false };

  const resolved = await resolveRecipients(user.id, {
    bcc: splitAddresses(parsed.data.bcc),
    cc: splitAddresses(parsed.data.cc),
    to: splitAddresses(parsed.data.to),
  });
  if (!resolved.ok) return resolved;
  if (!resolved.recipients.some(recipient => recipient.kind === 'to')) {
    return { error: 'Add at least one recipient.', ok: false };
  }

  const sentAt = new Date();
  const threadId = `thr-${crypto.randomUUID().slice(0, 8)}`;
  const messageId = `msg-${crypto.randomUUID().slice(0, 8)}`;
  await prisma.thread.create({
    data: {
      id: threadId,
      messages: {
        create: {
          body,
          fromId: user.id,
          id: messageId,
          recipients: {
            create: resolved.recipients.map(recipient => ({ kind: recipient.kind, userId: recipient.userId })),
          },
          sentAt,
        },
      },
      states: {
        create: [
          { mailbox: 'sent', read: true, userId: user.id },
          ...resolved.recipients
            .filter(recipient => recipient.account)
            .map(recipient => ({ mailbox: 'inbox', read: false, userId: recipient.userId })),
        ],
      },
      subject,
      updatedAt: sentAt,
    },
  });

  updateTag(threadTags.list(user.id));
  for (const recipient of resolved.recipients) if (recipient.account) updateTag(threadTags.list(recipient.userId));
  return { messageId, ok: true };
}

// Undo for a message you just sent: only your own message goes, and the thread with it when nothing else remains.
export async function unsendMessage(messageId: string): Promise<ActionResult> {
  const user = await verifyUser();
  const message = await prisma.message.findUnique({
    include: { thread: { include: { messages: { orderBy: { sentAt: 'desc' } }, states: true } } },
    where: { id: messageId },
  });
  if (!message || message.fromId !== user.id) return { error: 'That message could not be found.', ok: false };

  const remaining = message.thread.messages.filter(other => other.id !== messageId);
  if (remaining.length === 0) {
    await prisma.thread.delete({ where: { id: message.threadId } });
  } else {
    await prisma.$transaction([
      prisma.message.delete({ where: { id: messageId } }),
      prisma.thread.update({ data: { updatedAt: remaining[0].sentAt }, where: { id: message.threadId } }),
    ]);
  }

  updateTag(threadTags.detail(message.threadId));
  for (const state of message.thread.states) updateTag(threadTags.list(state.userId));
  return { ok: true };
}
