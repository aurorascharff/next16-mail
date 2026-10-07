import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { EmptyState } from '@/components/ui/empty-state';
import { ComposeButton } from '@/features/thread/components/compose-button';
import { SelectAll, SelectionProvider } from '@/features/thread/components/selection';
import { ThreadList, ThreadListSkeleton } from '@/features/thread/components/thread-list';
import { ListTitle, ThreadListHeader } from '@/features/thread/components/thread-list-header';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  const query = searchParams.then(params => (typeof params.q === 'string' ? params.q.trim() : ''));

  return (
    <>
      <div className="flex h-full flex-col" data-thread-list>
        <AnimatedSuspense fallback={<ThreadListSkeleton count={4} title="Search" />}>
          {query.then(q =>
            q ? (
              <ThreadList page={1} q={q} title="Search" />
            ) : (
              <SelectionProvider list={q}>
                <ThreadListHeader
                  leading={
                    <>
                      <SelectAll />
                      <ListTitle>Search</ListTitle>
                    </>
                  }
                />
                <div className="thread-results min-h-0 flex-1 [scrollbar-gutter:stable] overflow-y-auto overscroll-y-contain">
                  <EmptyState className="m-3" title="Search your mail" />
                </div>
              </SelectionProvider>
            ),
          )}
        </AnimatedSuspense>
      </div>
      <ComposeButton variant="fab" />
    </>
  );
}
