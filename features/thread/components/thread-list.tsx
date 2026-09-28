import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { MAILBOX_LABELS, PAGE_SIZE, type Mailbox } from '../thread-mailboxes';
import { getThreads, searchThreads } from '../thread-queries';
import { ListTitle, ThreadListHeader } from './thread-list-header';
import { ThreadRows } from './thread-rows';

const emptyCopy: Record<Mailbox, { body: string; title: string }> = {
  archive: { body: 'Archived conversations land here and stay searchable.', title: 'Nothing archived' },
  inbox: { body: 'New conversations show up here as they arrive.', title: 'Inbox zero' },
  sent: { body: 'Replies and new messages you write show up here.', title: 'Nothing sent yet' },
  starred: { body: 'Star a conversation to keep it close.', title: 'No starred conversations' },
};

export async function ThreadList({ mailbox, page }: { mailbox: Mailbox; page: number }) {
  const { threads, total } = await getThreads(mailbox, page);

  if (total === 0) {
    return (
      <>
        <ThreadListHeader leading={<ListTitle spaced>{MAILBOX_LABELS[mailbox]}</ListTitle>} />
        <EmptyState body={emptyCopy[mailbox].body} className="m-3" title={emptyCopy[mailbox].title} />
      </>
    );
  }

  return (
    <ThreadRows
      mailbox={mailbox}
      pager={{ base: `/${mailbox}`, page, pageSize: PAGE_SIZE, total }}
      threads={threads}
      title={MAILBOX_LABELS[mailbox]}
    />
  );
}

export async function SearchResults({ query }: { query: string }) {
  const threads = await searchThreads(query);

  if (threads.length === 0) {
    return (
      <>
        <ThreadListHeader leading={<ListTitle spaced>Search</ListTitle>} />
        <EmptyState className="m-3" title="No results" />
      </>
    );
  }

  return (
    <ThreadRows
      pager={{ base: '/search', page: 1, pageSize: Math.max(threads.length, 1), total: threads.length }}
      search={query}
      threads={threads}
      title="Search"
    />
  );
}

export function ThreadListSkeleton({ count = 6, title = '' }: { count?: number; title?: string }) {
  return (
    <div aria-hidden>
      <ThreadListHeader leading={<ListTitle spaced>{title}</ListTitle>} />
      <ul className="flex flex-col">
        {Array.from({ length: count }).map((_, index) => (
          <li
            className="border-divider/70 dark:border-divider-dark/70 grid h-21 grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-3 border-b px-4 py-3 sm:px-5"
            key={index}
          >
            <Skeleton className="size-9 rounded-full" />
            <div className="flex flex-col gap-3">
              <Skeleton className={cn('h-4', index % 2 === 0 ? 'w-40' : 'w-32')} />
              <Skeleton className={cn('h-4', index % 3 === 0 ? 'w-1/2' : 'w-2/3')} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
