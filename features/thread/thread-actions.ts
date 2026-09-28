'use server';

import { updateTag } from 'next/cache';
import { redirect, RedirectType } from 'next/navigation';
import { z } from 'zod';
import { verifyUser } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { threadTags } from './thread-cache';

type ActionResult = { ok: true } | { ok: false; error: string };

export async function toggleStar(threadId: string, starred: boolean): Promise<ActionResult> {
  const user = await verifyUser();
  const state = await prisma.threadState.findUnique({ where: { userId_threadId: { threadId, userId: user.id } } });
  if (!state) return { error: 'That conversation could not be found.', ok: false };

  await prisma.threadState.update({ data: { starred }, where: { userId_threadId: { threadId, userId: user.id } } });
  updateTag(threadTags.list(user.id));
  return { ok: true };
}

export async function moveThread(threadId: string, mailbox: 'inbox' | 'archive'): Promise<ActionResult> {
  const user = await verifyUser();
  const state = await prisma.threadState.findUnique({ where: { userId_threadId: { threadId, userId: user.id } } });
  if (!state) return { error: 'That conversation could not be found.', ok: false };

  await prisma.threadState.update({ data: { mailbox }, where: { userId_threadId: { threadId, userId: user.id } } });
  updateTag(threadTags.list(user.id));
  return { ok: true };
}

export async function markThreadRead(threadId: string): Promise<ActionResult> {
  const user = await verifyUser();
  const { count } = await prisma.threadState.updateMany({
    data: { read: true },
    where: { read: false, threadId, userId: user.id },
  });
  if (count > 0) updateTag(threadTags.list(user.id));
  return { ok: true };
}

export type ReplyState = { ok: true; sentAt: string } | { ok: false; error: string } | null;

const replySchema = z.object({
  body: z.string().trim().min(1, 'Write a reply first.').max(4000, 'Keep replies under 4000 characters.'),
  threadId: z.string().min(1),
});

export async function sendReply(_state: ReplyState, formData: FormData): Promise<ReplyState> {
  const user = await verifyUser();
  const parsed = replySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message, ok: false };
  const { body, threadId } = parsed.data;

  const thread = await prisma.thread.findUnique({
    include: {
      messages: { include: { recipients: true }, orderBy: { sentAt: 'asc' } },
      states: { where: { userId: user.id } },
    },
    where: { id: threadId },
  });
  if (!thread || thread.states.length === 0) return { error: 'That conversation could not be found.', ok: false };

  const others = new Set<string>();
  for (const message of thread.messages) {
    others.add(message.fromId);
    for (const recipient of message.recipients) others.add(recipient.userId);
  }
  others.delete(user.id);
  const recipientIds = [...others];
  const accounts = await prisma.user.findMany({
    select: { id: true },
    where: { account: true, id: { in: recipientIds } },
  });
  const sentAt = new Date();

  await prisma.$transaction([
    prisma.message.create({
      data: {
        body,
        fromId: user.id,
        id: `msg-${crypto.randomUUID().slice(0, 8)}`,
        recipients: { create: recipientIds.map(userId => ({ kind: 'to', userId })) },
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
  return { ok: true, sentAt: sentAt.toISOString() };
}

export type ComposeState = { ok: false; error: string } | null;

const composeSchema = z.object({
  body: z.string().trim().min(1, 'Write a message first.').max(4000, 'Keep messages under 4000 characters.'),
  subject: z.string().trim().min(1, 'Add a subject.').max(120, 'Keep the subject under 120 characters.'),
  to: z.string().min(1, 'Choose a recipient.'),
});

export async function composeMessage(_state: ComposeState, formData: FormData): Promise<ComposeState> {
  const user = await verifyUser();
  const parsed = composeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message, ok: false };
  const { body, subject, to } = parsed.data;

  // Only people this account can already see, the same list the form renders, never an arbitrary id.
  const recipient = await prisma.user.findFirst({
    select: { account: true, id: true },
    where: {
      NOT: { id: user.id },
      OR: [{ account: true }, { messages: { some: { thread: { states: { some: { userId: user.id } } } } } }],
      id: to,
    },
  });
  if (!recipient) return { error: 'Choose someone from your contacts.', ok: false };

  const sentAt = new Date();
  const threadId = `thr-${crypto.randomUUID().slice(0, 8)}`;
  await prisma.thread.create({
    data: {
      id: threadId,
      messages: {
        create: {
          body,
          fromId: user.id,
          id: `msg-${crypto.randomUUID().slice(0, 8)}`,
          recipients: { create: [{ kind: 'to', userId: recipient.id }] },
          sentAt,
        },
      },
      states: {
        create: [
          { mailbox: 'sent', read: true, userId: user.id },
          ...(recipient.account ? [{ mailbox: 'inbox', read: false, userId: recipient.id }] : []),
        ],
      },
      subject,
      updatedAt: sentAt,
    },
  });

  updateTag(threadTags.list(user.id));
  if (recipient.account) updateTag(threadTags.list(recipient.id));
  redirect(`/sent/${threadId}`, RedirectType.replace);
}
