import { Skeleton } from '@/components/ui/skeleton';
import { getThreadSummary } from '../thread-queries';
import { LabelChip } from './label-chip';
import { MarkThreadRead } from './mark-thread-read';
import { SenderRow, SenderRowSkeleton } from './message-body';
import { ArchiveButton, BackToList, StarButton } from './thread-toolbar';
import type { Mailbox } from '../thread-mailboxes';

export async function ThreadHeader({
  children,
  mailbox,
  threadId,
}: {
  children: React.ReactNode;
  mailbox: Mailbox;
  threadId: string;
}) {
  const thread = await getThreadSummary(threadId);

  return (
    <>
      <header data-testid="thread-header">
        {!thread.read ? <MarkThreadRead threadId={threadId} /> : null}
        <div className="flex items-start gap-2 pt-6">
          <BackToList mailbox={mailbox} />
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="text-xl leading-7 sm:text-2xl sm:leading-8">{thread.subject}</h1>
            {thread.labels.map(label => (
              <LabelChip key={label.id} label={label} size="md" />
            ))}
          </div>
          <span className="text-gray flex h-7 shrink-0 items-center text-xs tabular-nums sm:h-8">
            {thread.messageCount === 1 ? '1 message' : `${thread.messageCount} messages`}
          </span>
        </div>
        <div className="mt-6">
          <SenderRow
            actions={
              <>
                <ArchiveButton mailbox={mailbox} threadId={thread.id} threadMailbox={thread.mailbox} />
                <StarButton starred={thread.starred} threadId={thread.id} />
              </>
            }
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
      <div className="flex h-7 items-center pt-6 sm:h-8">
        <Skeleton className="h-5 w-1/2 max-w-sm" />
      </div>
      <div className="mt-6">
        <SenderRowSkeleton />
      </div>
    </div>
  );
}
