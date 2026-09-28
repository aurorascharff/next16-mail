import { Skeleton } from '@/components/ui/skeleton';
import { getContacts, getThreadSummary } from '../thread-queries';
import { LabelChip } from './label-chip';
import { MarkThreadRead } from './mark-thread-read';
import { Attachments, MessageText, MessageTextSkeleton, SenderRow, SenderRowSkeleton } from './message-body';
import { ReplyForm } from './reply-form';
import { ArchiveButton, BackToList, StarButton } from './thread-toolbar';
import type { Mailbox } from '../thread-mailboxes';

const toolbarClass = 'flex h-14 items-center gap-1';

export async function ThreadHeader({
  children,
  mailbox,
  threadId,
}: {
  children: React.ReactNode;
  mailbox: Mailbox;
  threadId: string;
}) {
  const [thread, contacts] = await Promise.all([getThreadSummary(threadId), getContacts()]);
  const earlier = thread.messageCount - 1;

  return (
    <>
      <header data-testid="thread-header">
        {!thread.read ? <MarkThreadRead threadId={threadId} /> : null}
        <div className={toolbarClass}>
          <BackToList mailbox={mailbox} />
          <ArchiveButton mailbox={mailbox} threadId={thread.id} threadMailbox={thread.mailbox} />
          <StarButton starred={thread.starred} threadId={thread.id} />
          <span className="text-gray ml-2 text-xs tabular-nums">
            {thread.messageCount === 1 ? '1 message' : `${thread.messageCount} messages`}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="text-xl leading-7 sm:text-2xl sm:leading-8">{thread.subject}</h1>
          {thread.labels.map(label => (
            <LabelChip key={label.id} label={label} size="md" />
          ))}
        </div>
      </header>
      <article className="mt-6" data-testid="thread-latest">
        <SenderRow cc={thread.latest.cc} date={thread.latest.sentAt} from={thread.latest.from} to={thread.latest.to} />
        <div className="mt-5">
          <MessageText paragraphs={thread.latest.paragraphs} />
        </div>
        <Attachments attachments={thread.latest.attachments} />
      </article>
      <ReplyForm contacts={contacts} threadId={threadId} to={thread.latest.from.name.split(' ')[0]} />
      {earlier > 0 ? (
        <section className="border-divider/70 dark:border-divider-dark/70 mt-10 border-t pt-8">{children}</section>
      ) : null}
    </>
  );
}

export function ThreadHeaderSkeleton() {
  return (
    <div aria-hidden>
      <div className={toolbarClass}>
        <Skeleton className="skeleton-subtle size-8 rounded-full lg:hidden" />
        <Skeleton className="skeleton-subtle size-8 rounded-full" />
        <Skeleton className="skeleton-subtle size-8 rounded-full" />
      </div>
      <div className="mt-6 flex h-7 items-center sm:h-8">
        <Skeleton className="h-5 w-1/2 max-w-sm" />
      </div>
      <div className="mt-6">
        <SenderRowSkeleton />
      </div>
      <div className="mt-5">
        <MessageTextSkeleton lines={4} />
      </div>
    </div>
  );
}
