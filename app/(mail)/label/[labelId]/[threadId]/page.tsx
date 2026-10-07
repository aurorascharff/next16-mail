import { Suspense } from 'react';
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

export default function LabelThreadPage({ params }: PageProps<'/label/[labelId]/[threadId]'>) {
  const query = params.then(({ labelId, threadId }) => ({
    backHref: `/label/${encodeURIComponent(labelId)}` as Route,
    threadId,
  }));

  return (
    <div className="flex h-full flex-col">
      <Suspense fallback={<ThreadToolbarSkeleton />}>
        {query.then(({ backHref, threadId }) => (
          <ThreadToolbar backHref={backHref} threadId={threadId} />
        ))}
      </Suspense>
      <article className="min-h-0 flex-1 [scrollbar-gutter:stable] overflow-y-auto overscroll-y-contain px-5 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <AnimatedSuspense fallback={<ThreadHeaderSkeleton />}>
            {query.then(({ threadId }) => (
              <>
                <ThreadHeader threadId={threadId} />
                <div className="mt-5">
                  <ErrorBoundary title="This conversation could not be loaded">
                    <AnimatedSuspense fallback={<LatestMessageSkeleton />}>
                      <LatestMessage threadId={threadId} />
                      <AnimatedSuspense fallback={<EarlierMessagesSkeleton />}>
                        <EarlierMessages threadId={threadId} />
                      </AnimatedSuspense>
                    </AnimatedSuspense>
                  </ErrorBoundary>
                </div>
              </>
            ))}
          </AnimatedSuspense>
        </div>
      </article>
    </div>
  );
}
