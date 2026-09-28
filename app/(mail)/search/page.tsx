import { Suspense } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { SelectAll, SelectionProvider } from '@/features/thread/components/selection';
import {
  ThreadList,
  ThreadListHeaderFor,
  ThreadListSkeleton,
  ThreadRowsSkeleton,
} from '@/features/thread/components/thread-list';
import { ListTitle, ThreadListHeader } from '@/features/thread/components/thread-list-header';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  const query = searchParams.then(params => (typeof params.q === 'string' ? params.q.trim() : ''));

  return (
    <div className="thread-results h-full overflow-y-auto overscroll-y-contain" data-thread-list>
      <Suspense fallback={<ThreadListSkeleton count={4} title="Search" />}>
        {query.then(q =>
          q ? (
            <SelectionProvider key={q}>
              <ThreadListHeaderFor page={1} q={q} title="Search" />
              <Suspense fallback={<ThreadRowsSkeleton count={4} />}>
                <ThreadList page={1} q={q} />
              </Suspense>
            </SelectionProvider>
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
