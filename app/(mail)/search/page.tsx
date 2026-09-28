import { Suspense } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
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
    <div className="h-full overflow-y-auto overscroll-y-contain" data-thread-list>
      <Suspense fallback={<ThreadListSkeleton count={4} title="Search" />}>
        {query.then(q =>
          q ? (
            <SelectionProvider key={q}>
              <ThreadListHeaderFor page={1} q={q} title="Search" />
              <div className="thread-results">
                <AnimatedSuspense fallback={<ThreadRowsSkeleton count={4} />}>
                  <ThreadList page={1} q={q} />
                </AnimatedSuspense>
              </div>
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
              <div className="thread-results">
                <EmptyState className="m-3" title="Search your mail" />
              </div>
            </>
          ),
        )}
      </Suspense>
    </div>
  );
}
