import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { formatFullDate } from '@/lib/utils';
import { getThreadSummary } from '../thread-queries';
import { LabelChip } from './label-chip';
import { MarkThreadRead } from './mark-thread-read';
import { ArchiveButton, BackToList, StarButton } from './thread-toolbar';
import type { Mailbox } from '../thread-mailboxes';
import type { Participant } from '../types/thread';

/**
 * Everything above the fold: toolbar, subject, who wrote last, and their opening paragraph.
 * A hovered row resolves this in its per-link prefetch, so it is on screen the moment the thread opens.
 */
export async function ThreadHeader({ mailbox, threadId }: { mailbox: Mailbox; threadId: string }) {
  const thread = await getThreadSummary(threadId);

  return (
    <header data-testid="thread-header">
      {!thread.read ? <MarkThreadRead threadId={threadId} /> : null}
      <div className="flex h-8 items-center gap-1">
        <BackToList mailbox={mailbox} />
        <ArchiveButton mailbox={mailbox} threadId={thread.id} threadMailbox={thread.mailbox} />
        <StarButton starred={thread.starred} threadId={thread.id} />
        <span className="text-muted ml-auto text-xs tabular-nums">
          {thread.messageCount === 1 ? '1 message' : `${thread.messageCount} messages`}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-xl leading-7">{thread.subject}</h1>
        {thread.labels.map(label => (
          <LabelChip key={label.id} label={label} size="md" />
        ))}
      </div>
      <SenderRow date={thread.latest.sentAt} from={thread.latest.from} to={thread.latest.to} />
      <p className="mt-5 text-[15px] leading-[1.65] text-black/85 dark:text-white/85" data-testid="thread-opening">
        {thread.latest.opening}
      </p>
    </header>
  );
}

export function SenderRow({ date, from, to }: { date: string; from: Participant; to: Participant[] }) {
  return (
    <div className="mt-6 flex h-11 items-center gap-3">
      <UserAvatar name={from.name} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="flex h-5 items-center gap-2 text-sm">
          <span className="truncate font-semibold">{from.name}</span>
          <span className="text-muted hidden truncate text-[13px] sm:inline">{from.email}</span>
        </p>
        <p className="text-muted flex h-5 items-center truncate text-[13px]">
          to {to.map(person => person.name.split(' ')[0]).join(', ') || 'me'}
        </p>
      </div>
      <time className="text-muted shrink-0 text-xs tabular-nums" dateTime={date}>
        {formatFullDate(new Date(date))}
      </time>
    </div>
  );
}

export function SenderRowSkeleton() {
  return (
    <div className="mt-6 flex h-11 items-center gap-3">
      <Skeleton className="skeleton-subtle size-10 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="flex h-5 items-center gap-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="skeleton-subtle hidden h-3 w-36 sm:block" />
        </span>
        <span className="flex h-5 items-center">
          <Skeleton className="skeleton-subtle h-3 w-24" />
        </span>
      </div>
      <Skeleton className="skeleton-subtle h-3 w-28" />
    </div>
  );
}

export function ThreadHeaderSkeleton() {
  return (
    <div aria-hidden>
      <div className="flex h-8 items-center gap-1">
        <Skeleton className="skeleton-subtle size-8 rounded-full lg:hidden" />
        <Skeleton className="skeleton-subtle size-8 rounded-full" />
        <Skeleton className="skeleton-subtle size-8 rounded-full" />
        <Skeleton className="skeleton-subtle ml-auto h-3 w-16" />
      </div>
      <div className="mt-5 flex h-7 items-center">
        <Skeleton className="h-5 w-2/3 max-w-md" />
      </div>
      <SenderRowSkeleton />
      <div className="mt-5 flex flex-col">
        <span className="flex h-6 items-center">
          <Skeleton className="h-3.5 w-full" />
        </span>
        <span className="flex h-6 items-center">
          <Skeleton className="h-3.5 w-11/12" />
        </span>
        <span className="flex h-6 items-center">
          <Skeleton className="h-3.5 w-2/3" />
        </span>
      </div>
    </div>
  );
}
