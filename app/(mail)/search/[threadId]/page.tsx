import { Suspense } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { ThreadHeader, ThreadHeaderSkeleton } from '@/features/thread/components/thread-header';
import { ThreadMessages, ThreadMessagesSkeleton } from '@/features/thread/components/thread-messages';
import type { Route } from 'next';

export default function SearchThreadPage({ params, searchParams }: PageProps<'/search/[threadId]'>) {
  const query = Promise.all([params, searchParams]).then(([{ threadId }, values]) => ({
    backHref: (typeof values.q === 'string' && values.q
      ? `/search?q=${encodeURIComponent(values.q)}`
      : '/search') as Route,
    threadId,
  }));

  return (
    <article className="mx-auto w-full max-w-4xl px-5 pb-24 sm:px-8">
      <Suspense fallback={<ThreadHeaderSkeleton />}>
        {query.then(({ backHref, threadId }) => (
          <AnimatedSuspense fallback={<ThreadHeaderSkeleton />}>
            <ThreadHeader backHref={backHref} threadId={threadId}>
              <ErrorBoundary title="This conversation could not be loaded">
                <AnimatedSuspense fallback={<ThreadMessagesSkeleton />}>
                  <ThreadMessages threadId={threadId} />
                </AnimatedSuspense>
              </ErrorBoundary>
            </ThreadHeader>
          </AnimatedSuspense>
        ))}
      </Suspense>
    </article>
  );
}
