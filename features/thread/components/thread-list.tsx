import { Suspense } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { listHref, toggled, type ListLocation } from '../thread-list-url';
import { PAGE_SIZE, type Mailbox } from '../thread-mailboxes';
import { getThreads, searchThreads, type ThreadPage } from '../thread-queries';
import { BulkActions } from './bulk-actions';
import { ClearSelection, ListTitle, Pager, SelectAll, ThreadListHeader } from './thread-list-header';
import { ThreadRow } from './thread-row';
import type { Route } from 'next';

type ListProps = { mailbox?: Mailbox; page: number; q?: string; selected: string[] };

const emptyCopy: Record<Mailbox, { body: string; title: string }> = {
  archive: { body: 'Archived conversations land here and stay searchable.', title: 'Nothing archived' },
  inbox: { body: 'New conversations show up here as they arrive.', title: 'Inbox zero' },
  sent: { body: 'Replies and new messages you write show up here.', title: 'Nothing sent yet' },
  starred: { body: 'Star a conversation to keep it close.', title: 'No starred conversations' },
};

function locationOf({ mailbox, page, q }: ListProps): ListLocation {
  return mailbox ? { base: `/${mailbox}`, page } : { base: '/search', q };
}

async function loadPage({ mailbox, page, q }: ListProps): Promise<ThreadPage> {
  if (mailbox) return getThreads(mailbox, page);
  const threads = await searchThreads(q ?? '');
  return { threads, total: threads.length };
}

// Selection lives in the URL, so the header renders from the route alone and only its two data-dependent
// controls wait for the rows.
export function ThreadListToolbar({ title, ...props }: ListProps & { title: string }) {
  const list = locationOf(props);
  const clearHref = listHref(list);
  return (
    <ThreadListHeader
      leading={
        <>
          <Suspense fallback={<SelectAll />}>
            <SelectAllFor {...props} />
          </Suspense>
          {props.selected.length > 0 ? (
            <BulkActions clearHref={clearHref} ids={props.selected} mailbox={props.mailbox} />
          ) : (
            <ListTitle>{title}</ListTitle>
          )}
        </>
      }
      trailing={
        props.selected.length > 0 ? (
          <ClearSelection href={clearHref} />
        ) : (
          <Suspense>
            <PagerFor {...props} />
          </Suspense>
        )
      }
    />
  );
}

async function SelectAllFor(props: ListProps) {
  const { threads } = await loadPage(props);
  if (threads.length === 0) return <SelectAll />;
  const ids = threads.map(thread => thread.id);
  const all = ids.every(id => props.selected.includes(id));
  return <SelectAll checked={all} href={listHref({ ...locationOf(props), selected: all ? [] : ids })} />;
}

async function PagerFor(props: ListProps) {
  const { threads, total } = await loadPage(props);
  const pageSize = props.mailbox ? PAGE_SIZE : Math.max(total, 1);
  return <Pager count={threads.length} list={locationOf(props)} pageSize={pageSize} total={total} />;
}

export async function ThreadList(props: ListProps) {
  const { threads, total } = await loadPage(props);
  if (total === 0) {
    const copy = props.mailbox ? emptyCopy[props.mailbox] : { body: undefined, title: 'No results' };
    return <EmptyState body={copy.body} className="m-3" title={copy.title} />;
  }
  const list = locationOf(props);
  return (
    <ul aria-label="Conversations" className="flex flex-col" data-testid="thread-rows">
      {threads.map(thread => (
        <ThreadRow
          href={
            (props.mailbox
              ? `/${props.mailbox}/${thread.id}`
              : `/search/${thread.id}?q=${encodeURIComponent(props.q ?? '')}`) as Route
          }
          key={thread.id}
          mailbox={props.mailbox}
          selected={props.selected.includes(thread.id)}
          selectHref={listHref({ ...list, selected: toggled(props.selected, thread.id) })}
          thread={thread}
        />
      ))}
    </ul>
  );
}

export function ThreadListSkeleton({ count = 6, title = '' }: { count?: number; title?: string }) {
  return (
    <div aria-hidden>
      <ThreadListHeader
        leading={
          <>
            <SelectAll />
            <ListTitle>{title}</ListTitle>
          </>
        }
      />
      <ThreadRowsSkeleton count={count} />
    </div>
  );
}

export function ThreadRowsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul aria-hidden className="flex flex-col">
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
  );
}
