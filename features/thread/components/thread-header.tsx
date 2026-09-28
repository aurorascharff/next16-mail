import { Skeleton } from '@/components/ui/skeleton';
import { getThreadSummary } from '../thread-queries';
import { LabelChip } from './label-chip';
import { MarkThreadRead } from './mark-thread-read';
import { SenderRow, SenderRowSkeleton } from './message-body';
import { ArchiveButton, BackToList, StarButton } from './thread-toolbar';
import type { Route } from 'next';

export async function ThreadHeader({
  backHref,
  children,
  threadId,
}: {
  backHref: Route;
  children: React.ReactNode;
  threadId: string;
}) {
  const thread = await getThreadSummary(threadId);

  return (
    <>
      <header data-testid="thread-header">
        {!thread.read ? <MarkThreadRead threadId={threadId} /> : null}
        <div className="-mx-5 flex h-14 items-center gap-1 px-3 sm:-mx-8 sm:px-6">
          <BackToList href={backHref} />
          <span className="bg-divider dark:bg-divider-dark mx-1 h-5 w-px" />
          <ArchiveButton backHref={backHref} threadId={thread.id} threadMailbox={thread.mailbox} />
          <StarButton starred={thread.starred} threadId={thread.id} />
          <span className="text-gray ml-auto text-xs tabular-nums">
            {thread.messageCount === 1 ? '1 message' : `${thread.messageCount} messages`}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="text-xl leading-7 font-semibold sm:text-2xl sm:leading-8">{thread.subject}</h1>
          {thread.labels.map(label => (
            <LabelChip key={label.id} label={label} size="md" />
          ))}
        </div>
        <div className="mt-6">
          <SenderRow
            cc={thread.latest.cc}
            date={thread.latest.sentAt}
            from={thread.latest.from}
            to={thread.latest.to}
          />
        </div>
      </header>
      <div className="mt-5">{children}</div>
    </>
  );
}

export function ThreadHeaderSkeleton() {
  return (
    <div aria-hidden>
      <div className="-mx-5 flex h-14 items-center gap-1 px-3 sm:-mx-8 sm:px-6">
        <Skeleton className="size-9 rounded-full" />
        <span className="bg-divider dark:bg-divider-dark mx-1 h-5 w-px" />
        <Skeleton className="size-9 rounded-full" />
        <Skeleton className="size-9 rounded-full" />
      </div>
      <div className="mt-4 flex h-7 items-center sm:h-8">
        <Skeleton className="h-6 w-3/5 max-w-xl" />
      </div>
      <div className="mt-6">
        <SenderRowSkeleton />
      </div>
    </div>
  );
}
