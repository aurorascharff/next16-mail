import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { PAGE_SIZE, type Mailbox } from '../thread-mailboxes';
import { getLabelThreads, getThreads, searchThreads, type ThreadPage } from '../thread-queries';
import { SelectAll, SelectionProvider, ThreadListToolbar } from './selection';
import { ListTitle, Pager, ThreadListHeader } from './thread-list-header';
import { ThreadRow } from './thread-row';
import type { ListLocation } from '../thread-list-url';
import type { ThreadListItem } from '../types/thread';
import type { Route } from 'next';

type ListProps = { mailbox?: Mailbox; page: number; q?: string };

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

export async function ThreadList({ title, ...props }: ListProps & { title: string }) {
  const { threads, total } = await loadPage(props);
  const pageSize = props.mailbox ? PAGE_SIZE : Math.max(total, 1);
  const list = props.mailbox ? `${props.mailbox}:${props.page}` : (props.q ?? '');
  const empty = props.mailbox ? emptyCopy[props.mailbox] : { body: undefined, title: 'No results' };

  return (
    <SelectionProvider list={list}>
      <ThreadListToolbar
        mailbox={props.mailbox}
        pager={<Pager count={threads.length} list={locationOf(props)} pageSize={pageSize} total={total} />}
        selectAll={<SelectAll threads={threads.map(({ id, read, starred }) => ({ id, read, starred }))} />}
        title={title}
      />
      <div
        className="thread-results min-h-0 flex-1 [scrollbar-gutter:stable] overflow-y-auto overscroll-y-contain"
        key={list}
      >
        {total === 0 ? (
          <EmptyState body={empty.body} className="m-3" title={empty.title} />
        ) : (
          <ThreadRows hrefFor={thread => threadHref(props, thread.id)} mailbox={props.mailbox} threads={threads} />
        )}
      </div>
    </SelectionProvider>
  );
}

function threadHref(props: ListProps, threadId: string) {
  return (
    props.mailbox ? `/${props.mailbox}/${threadId}` : `/search/${threadId}?q=${encodeURIComponent(props.q ?? '')}`
  ) as Route;
}

function ThreadRows({
  hrefFor,
  mailbox,
  threads,
}: {
  hrefFor: (thread: ThreadListItem) => Route;
  mailbox?: Mailbox;
  threads: ThreadListItem[];
}) {
  return (
    <ul aria-label="Conversations" className="flex flex-col" data-testid="thread-rows">
      {threads.map(thread => (
        <ThreadRow href={hrefFor(thread)} key={thread.id} mailbox={mailbox} thread={thread} />
      ))}
    </ul>
  );
}

export async function LabelThreadList({ labelId, page }: { labelId: string; page: number }) {
  const { label, threads, total } = await getLabelThreads(labelId, page);
  const base = `/label/${encodeURIComponent(label.id)}`;

  return (
    <SelectionProvider list={`label:${label.id}:${page}`}>
      <ThreadListToolbar
        pager={<Pager count={threads.length} list={{ base, page }} pageSize={PAGE_SIZE} total={total} />}
        selectAll={<SelectAll threads={threads.map(({ id, read, starred }) => ({ id, read, starred }))} />}
        title={label.name}
      />
      <div
        className="thread-results min-h-0 flex-1 [scrollbar-gutter:stable] overflow-y-auto overscroll-y-contain"
        key={`${label.id}:${page}`}
      >
        {total === 0 ? (
          <EmptyState body="Conversations with this label show up here." className="m-3" title="No conversations" />
        ) : (
          <ThreadRows hrefFor={thread => `${base}/${thread.id}` as Route} threads={threads} />
        )}
      </div>
    </SelectionProvider>
  );
}

export function ThreadListSkeleton({ count = 6, title = '' }: { count?: number; title?: string }) {
  return (
    <>
      <div aria-hidden>
        <ThreadListHeader
          leading={
            <>
              <SelectAll />
              <ListTitle>{title}</ListTitle>
            </>
          }
        />
      </div>
      <div
        aria-hidden
        className="thread-results min-h-0 flex-1 [scrollbar-gutter:stable] overflow-y-auto overscroll-y-contain"
      >
        <ThreadRowsSkeleton count={count} />
      </div>
    </>
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
