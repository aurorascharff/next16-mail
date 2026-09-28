import { Suspense } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import {
  ThreadList,
  ThreadListSkeleton,
  ThreadListToolbar,
  ThreadRowsSkeleton,
} from '@/features/thread/components/thread-list';
import { ListTitle, SelectAll, ThreadListHeader } from '@/features/thread/components/thread-list-header';
import { parseSelected } from '@/features/thread/thread-list-url';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  const query = searchParams.then(params => ({
    q: typeof params.q === 'string' ? params.q.trim() : '',
    selected: parseSelected(params.selected),
  }));

  return (
    <div className="thread-results h-full overflow-y-auto overscroll-y-contain" data-thread-list>
      <Suspense fallback={<ThreadListSkeleton count={4} title="Search" />}>
        {query.then(({ q, selected }) =>
          q ? (
            <>
              <ThreadListToolbar page={1} q={q} selected={selected} title="Search" />
              <Suspense fallback={<ThreadRowsSkeleton count={4} />}>
                <ThreadList page={1} q={q} selected={selected} />
              </Suspense>
            </>
          ) : (
            <>
              <ThreadListHeader
                leading={
                  <>
                    <SelectAll />
                    <ListTitle>Search</ListTitle>
                  </>
                }
              />
              <EmptyState className="m-3" title="Search your mail" />
            </>
          ),
        )}
      </Suspense>
    </div>
  );
}
