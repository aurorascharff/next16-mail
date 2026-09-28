import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { getThreads, searchThreads } from '../thread-queries';
import { ThreadRows } from './thread-rows';
import type { Mailbox } from '../thread-mailboxes';

const emptyCopy: Record<Mailbox, { body: string; title: string }> = {
  archive: { body: 'Archived conversations land here and stay searchable.', title: 'Nothing archived' },
  inbox: { body: 'New conversations show up here as they arrive.', title: 'Inbox zero' },
  sent: { body: 'Replies and new messages you write show up here.', title: 'Nothing sent yet' },
  starred: { body: 'Star a conversation to keep it close.', title: 'No starred conversations' },
};

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
    return <EmptyState className="m-3" title="No results" />;
  }

  return <ThreadRows threads={threads} />;
}

export function ThreadListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul aria-hidden className="flex flex-col">
      {Array.from({ length: count }).map((_, index) => (
        <li
          className="border-divider/70 dark:border-divider-dark/70 grid h-[3.75rem] grid-cols-[1rem_2.25rem_minmax(0,1fr)] items-center gap-x-3 border-b px-4 py-3 sm:px-5"
          key={index}
        >
          <span />
          <Skeleton className="skeleton-subtle size-9 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className={cn('h-3', index % 2 === 0 ? 'w-32' : 'w-24')} />
            <Skeleton className={cn('skeleton-subtle h-3', index % 3 === 0 ? 'w-3/5' : 'w-4/5')} />
          </div>
        </li>
      ))}
    </ul>
  );
}
