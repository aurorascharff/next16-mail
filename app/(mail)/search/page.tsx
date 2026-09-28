import { Suspense } from 'react';
import { MailSplit } from '@/components/mail-split';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { BrandMark } from '@/components/ui/brand-mark';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchResults, ThreadListSkeleton } from '@/features/thread/components/thread-list';
import { ThreadListHeader } from '@/features/thread/components/thread-list-header';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  const query = searchParams.then(params => (typeof params.q === 'string' ? params.q.trim() : ''));

  return (
    <MailSplit
      list={
        <>
          <ThreadListHeader title="Search" />
          <div className="thread-results min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <Suspense fallback={<ThreadListSkeleton count={4} />}>
              {query.then(value =>
                value ? (
                  <AnimatedSuspense fallback={<ThreadListSkeleton count={4} />} key={value}>
                    <SearchResults query={value} />
                  </AnimatedSuspense>
                ) : (
                  <EmptyState className="m-3" title="Search your mail" />
                ),
              )}
            </Suspense>
          </div>
        </>
      }
    >
      <div className="hidden h-full place-items-center px-6 text-center lg:grid">
        <div className="flex max-w-xs flex-col items-center gap-3">
          <BrandMark className="text-divider dark:text-divider-dark size-10" />
          <p className="text-sm font-medium">Search results open here</p>
        </div>
      </div>
    </MailSplit>
  );
}
