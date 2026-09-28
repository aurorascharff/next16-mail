import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { MAILBOX_LABELS, type Mailbox } from '../thread-mailboxes';
import { getThreads, searchThreads } from '../thread-queries';
import { ThreadRows } from './thread-rows';

const emptyCopy: Record<Mailbox, { body: string; title: string }> = {
  archive: { body: 'Archived conversations land here and stay searchable.', title: 'Nothing archived' },
  inbox: { body: 'New conversations show up here as they arrive.', title: 'Inbox zero' },
  sent: { body: 'Replies and new messages you write show up here.', title: 'Nothing sent yet' },
  starred: { body: 'Star a conversation to keep it close.', title: 'No starred conversations' },
};

/** The rows of one mailbox. A mailbox link resolves this in its per-link prefetch, so switching is instant. */
export async function ThreadList({ mailbox }: { mailbox: Mailbox }) {
  const threads = await getThreads(mailbox);

  if (threads.length === 0) {
    return <EmptyState body={emptyCopy[mailbox].body} className="m-3" title={emptyCopy[mailbox].title} />;
  }

  return <ThreadRows mailbox={mailbox} threads={threads} />;
}

export async function SearchResults({ query }: { query: string }) {
  const threads = await searchThreads(query);

  if (threads.length === 0) {
    return (
      <EmptyState
        body={`Nothing in ${Object.values(MAILBOX_LABELS).slice(0, 1).join('')}, Archive or Sent matches “${query}”.`}
        className="m-3"
        title="No results"
      />
    );
  }

  return <ThreadRows threads={threads} />;
}

export function ThreadListSkeleton({ count = 7 }: { count?: number }) {
  return (
    <ul aria-hidden className="flex flex-col">
      {Array.from({ length: count }).map((_, index) => (
        <li
          className={cn(
            'border-divider/60 dark:border-divider-dark/60 grid grid-cols-[2.25rem_minmax(0,1fr)_auto] gap-x-3 border-b px-4 py-3',
          )}
          key={index}
        >
          <Skeleton className="skeleton-subtle mt-0.5 size-9 rounded-full" />
          <div className="flex min-w-0 flex-col">
            <span className="flex h-5 items-center">
              <Skeleton className={cn('h-3.5', index % 3 === 0 ? 'w-40' : 'w-28')} />
            </span>
            <span className="flex h-5 items-center">
              <Skeleton className={cn('skeleton-subtle h-3.5', index % 2 === 0 ? 'w-4/5' : 'w-3/5')} />
            </span>
            <span className="flex h-5 items-center">
              <Skeleton className="skeleton-subtle h-3 w-11/12" />
            </span>
          </div>
          <span className="flex h-5 items-center">
            <Skeleton className="skeleton-subtle h-3 w-10" />
          </span>
        </li>
      ))}
    </ul>
  );
}
