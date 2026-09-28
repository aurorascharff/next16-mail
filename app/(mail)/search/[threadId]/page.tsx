import { Suspense } from 'react';
import { NavForward } from '@/components/animations';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import {
  ThreadHeader,
  ThreadHeaderSkeleton,
  ThreadToolbar,
  ThreadToolbarSkeleton,
} from '@/features/thread/components/thread-header';
import {
  EarlierMessages,
  EarlierMessagesSkeleton,
  LatestMessage,
  LatestMessageSkeleton,
} from '@/features/thread/components/thread-messages';
import type { Route } from 'next';

export default function SearchThreadPage({ params, searchParams }: PageProps<'/search/[threadId]'>) {
  const query = Promise.all([params, searchParams]).then(([{ threadId }, values]) => ({
    backHref: (typeof values.q === 'string' && values.q
      ? `/search?q=${encodeURIComponent(values.q)}`
      : '/search') as Route,
    threadId,
  }));

  return (
    <NavForward>
      <div className="flex h-full flex-col">
        <Suspense fallback={<ThreadToolbarSkeleton />}>
          {query.then(({ backHref, threadId }) => (
            <Suspense fallback={<ThreadToolbarSkeleton />}>
              <ThreadToolbar backHref={backHref} threadId={threadId} />
            </Suspense>
          ))}
        </Suspense>
        <article className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 pb-24 sm:px-8">
          <Suspense fallback={<ThreadHeaderSkeleton />}>
            {query.then(({ threadId }) => (
              <AnimatedSuspense fallback={<ThreadHeaderSkeleton />}>
                <ThreadHeader threadId={threadId}>
                  <ErrorBoundary title="This conversation could not be loaded">
                    <Suspense fallback={<LatestMessageSkeleton />}>
                      <LatestMessage threadId={threadId} />
                      <Suspense fallback={<EarlierMessagesSkeleton />}>
                        <EarlierMessages threadId={threadId} />
                      </Suspense>
                    </Suspense>
                  </ErrorBoundary>
                </ThreadHeader>
              </AnimatedSuspense>
            ))}
          </Suspense>
        </article>
      </div>
    </NavForward>
  );
}
