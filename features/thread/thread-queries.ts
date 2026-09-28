import 'server-only';

import { cacheLife, cacheTag, unstable_navigation } from 'next/cache';
import { notFound } from 'next/navigation';
import { isSlowEnabled } from '@/features/demo/demo-queries';
import { verifyUser } from '@/features/user/user-queries';
import { prisma, usesSqlite } from '@/lib/db';
import { delay } from '@/lib/utils';
import { threadTags } from './thread-cache';
import { MAILBOXES, PAGE_SIZE, type Mailbox } from './thread-mailboxes';
import type { Label, MailboxCounts, Participant, ThreadListItem, ThreadMessage, ThreadSummary } from './types/thread';

const participantSelect = { email: true, id: true, name: true } as const;

function mailboxWhere(userId: string, mailbox: Mailbox) {
  switch (mailbox) {
    case 'inbox':
      return { states: { some: { mailbox: 'inbox', userId } } };
    case 'archive':
      return { states: { some: { mailbox: 'archive', userId } } };
    case 'starred':
      return { states: { some: { starred: true, userId } } };
    case 'sent':
      return { messages: { some: { fromId: userId } }, states: { some: { userId } } };
  }
}

function matches(value: string): { contains: string } {
  const filter = usesSqlite ? { contains: value } : { contains: value, mode: 'insensitive' as const };
  return filter;
}

function shortName(name: string) {
  return name.startsWith('Stamp ') ? name : name.split(' ')[0];
}

function splitParagraphs(body: string) {
  return body
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);
}

/**
 * Unread counts for the sidebar. Depends on the session only, so the App Shell renders it once per account
 * and every mailbox link reuses it.
 */
export async function getMailboxCounts(): Promise<MailboxCounts> {
  const [user, slow] = await Promise.all([verifyUser(), isSlowEnabled()]);
  return getMailboxCountsForUser(user.id, slow);
}

async function getMailboxCountsForUser(userId: string, slow: boolean): Promise<MailboxCounts> {
  'use cache';
  cacheLife('hours');
  cacheTag(threadTags.list(userId));

  await delay(400, slow);
  const [inbox, starred, sent] = await Promise.all([
    prisma.threadState.count({ where: { mailbox: 'inbox', read: false, userId } }),
    prisma.threadState.count({ where: { read: false, starred: true, userId } }),
    prisma.thread.count({ where: { ...mailboxWhere(userId, 'sent'), states: { some: { read: false, userId } } } }),
  ]);
  return { archive: 0, inbox, sent, starred };
}

/** The rows of one mailbox. Keyed on the URL, so a mailbox link resolves it in a per-link prefetch. */
export type ThreadPage = { threads: ThreadListItem[]; total: number };

export async function getThreads(mailbox: Mailbox, page: number): Promise<ThreadPage> {
  const [user, slow] = await Promise.all([verifyUser(), isSlowEnabled()]);
  return getThreadsForUser(user.id, mailbox, page, slow);
}

async function getThreadsForUser(userId: string, mailbox: Mailbox, page: number, slow: boolean): Promise<ThreadPage> {
  'use cache';
  cacheLife('hours');
  cacheTag(threadTags.list(userId));

  await delay(700, slow);
  const where = mailboxWhere(userId, mailbox);
  const [threads, total] = await Promise.all([
    prisma.thread.findMany({
      include: {
        labels: true,
        messages: {
          include: { attachments: { select: { id: true } }, from: { select: participantSelect } },
          orderBy: { sentAt: 'asc' },
        },
        states: { where: { userId } },
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      where,
    }),
    prisma.thread.count({ where }),
  ]);
  return { threads: threads.map(thread => toListItem(thread, userId)), total };
}

export async function searchThreads(query: string): Promise<ThreadListItem[]> {
  const [user, slow] = await Promise.all([verifyUser(), isSlowEnabled()]);
  return searchThreadsForUser(user.id, query.trim().toLowerCase(), slow);
}

async function searchThreadsForUser(userId: string, query: string, slow: boolean): Promise<ThreadListItem[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(threadTags.list(userId));

  await delay(500, slow);
  if (!query) return [];
  const threads = await prisma.thread.findMany({
    include: {
      labels: true,
      messages: {
        include: { attachments: { select: { id: true } }, from: { select: participantSelect } },
        orderBy: { sentAt: 'asc' },
      },
      states: { where: { userId } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 25,
    where: {
      OR: [
        { subject: matches(query) },
        { messages: { some: { body: matches(query) } } },
        { messages: { some: { from: { name: matches(query) } } } },
        { labels: { some: { name: matches(query) } } },
      ],
      states: { some: { userId } },
    },
  });
  return threads.map(thread => toListItem(thread, userId));
}

type ThreadRow = Awaited<
  ReturnType<
    typeof prisma.thread.findMany<{
      include: {
        labels: true;
        messages: { include: { attachments: { select: { id: true } }; from: { select: typeof participantSelect } } };
        states: true;
      };
    }>
  >
>[number];

function toListItem(thread: ThreadRow, userId: string): ThreadListItem {
  const latest = thread.messages.at(-1)!;
  const state = thread.states[0];
  const participants = [...new Set(thread.messages.map(message => message.fromId))].map(id => {
    if (id === userId) return 'me';
    return shortName(thread.messages.find(message => message.fromId === id)!.from.name);
  });
  return {
    hasAttachments: thread.messages.some(message => message.attachments.length > 0),
    id: thread.id,
    labels: thread.labels,
    mailbox: state?.mailbox ?? 'inbox',
    messageCount: thread.messages.length,
    participants,
    read: state?.read ?? true,
    snippet: splitParagraphs(latest.body)[0] ?? '',
    starred: state?.starred ?? false,
    subject: thread.subject,
    updatedAt: thread.updatedAt.toISOString(),
  };
}

const messageInclude = {
  attachments: { orderBy: { name: 'asc' } },
  from: { select: participantSelect },
  recipients: { include: { user: { select: participantSelect } }, where: { kind: { not: 'bcc' } } },
} as const;

type MessageRow = Awaited<ReturnType<typeof prisma.message.findMany<{ include: typeof messageInclude }>>>[number];

function toMessage(message: MessageRow): ThreadMessage {
  return {
    attachments: message.attachments,
    cc: message.recipients.filter(recipient => recipient.kind === 'cc').map(recipient => recipient.user),
    from: message.from,
    id: message.id,
    paragraphs: splitParagraphs(message.body),
    sentAt: message.sentAt.toISOString(),
    to: message.recipients.filter(recipient => recipient.kind === 'to').map(recipient => recipient.user),
  };
}

// Everything about a thread except message content. Every row in view resolves this in its per-link prefetch.
export async function getThreadSummary(threadId: string): Promise<ThreadSummary> {
  const [user, slow] = await Promise.all([verifyUser(), isSlowEnabled()]);
  return getThreadSummaryForUser(threadId, user.id, slow);
}

async function getThreadSummaryForUser(threadId: string, userId: string, slow: boolean): Promise<ThreadSummary> {
  'use cache';
  cacheLife('hours');
  cacheTag(threadTags.detail(threadId), threadTags.list(userId));

  await delay(600, slow);
  const thread = await prisma.thread.findUnique({
    include: {
      _count: { select: { messages: true } },
      labels: true,
      messages: {
        include: {
          from: { select: participantSelect },
          recipients: { include: { user: { select: participantSelect } }, where: { kind: { not: 'bcc' } } },
        },
        orderBy: { sentAt: 'desc' },
        take: 1,
      },
      states: { where: { userId } },
    },
    where: { id: threadId },
  });
  const [latest] = thread?.messages ?? [];
  const [state] = thread?.states ?? [];
  if (!thread || !latest || !state) notFound();

  return {
    id: thread.id,
    labels: thread.labels,
    latest: {
      cc: latest.recipients.filter(recipient => recipient.kind === 'cc').map(recipient => recipient.user),
      from: latest.from,
      id: latest.id,
      sentAt: latest.sentAt.toISOString(),
      to: latest.recipients.filter(recipient => recipient.kind === 'to').map(recipient => recipient.user),
    },
    mailbox: state.mailbox,
    messageCount: thread._count.messages,
    read: state.read,
    starred: state.starred,
    subject: thread.subject,
  };
}

// Message content waits for `unstable_navigation()`, which keeps it out of the App Shell and every prefetch,
// so prefetching a page of rows never downloads bodies, while the cached result still serves the next visitor.
export async function getLatestMessage(threadId: string): Promise<ThreadMessage | null> {
  await unstable_navigation();
  return getLatestMessageCached(threadId, await isSlowEnabled());
}

async function getLatestMessageCached(threadId: string, slow: boolean): Promise<ThreadMessage | null> {
  'use cache';
  cacheLife('hours');
  cacheTag(threadTags.detail(threadId));

  await delay(1000, slow);
  const message = await prisma.message.findFirst({
    include: messageInclude,
    orderBy: { sentAt: 'desc' },
    where: { threadId },
  });
  return message ? toMessage(message) : null;
}

export async function getEarlierMessages(threadId: string): Promise<ThreadMessage[]> {
  await unstable_navigation();
  return getEarlierMessagesCached(threadId, await isSlowEnabled());
}

async function getEarlierMessagesCached(threadId: string, slow: boolean): Promise<ThreadMessage[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(threadTags.detail(threadId));

  await delay(1800, slow);
  const messages = await prisma.message.findMany({
    include: messageInclude,
    orderBy: { sentAt: 'desc' },
    skip: 1,
    where: { threadId },
  });
  return messages.map(toMessage);
}

export async function getContacts(): Promise<Participant[]> {
  const user = await verifyUser();
  return getContactsForUser(user.id);
}

async function getContactsForUser(userId: string): Promise<Participant[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(threadTags.list(userId));

  return prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: participantSelect,
    where: {
      OR: [
        { account: true },
        { messages: { some: { thread: { states: { some: { userId } } } } } },
        { recipients: { some: { message: { fromId: userId } } } },
      ],
      id: { not: userId },
    },
  });
}

export { MAILBOXES };

export async function getLabels(): Promise<Label[]> {
  'use cache';
  cacheLife('max');
  cacheTag(threadTags.labels);

  return prisma.label.findMany({ orderBy: { name: 'asc' } });
}
