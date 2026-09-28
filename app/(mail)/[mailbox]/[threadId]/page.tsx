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
import { isMailbox } from '@/features/thread/thread-mailboxes';
import type { Route } from 'next';

export default function ThreadPage({ params }: PageProps<'/[mailbox]/[threadId]'>) {
  const query = params.then(({ mailbox, threadId }) => ({
    backHref: `/${isMailbox(mailbox) ? mailbox : 'inbox'}` as Route,
    threadId,
  }));

  return (
    <div className="flex h-full flex-col">
      <Suspense fallback={<ThreadToolbarSkeleton />}>
        {query.then(({ backHref, threadId }) => (
          <Suspense fallback={<ThreadToolbarSkeleton />}>
            <ThreadToolbar backHref={backHref} threadId={threadId} />
          </Suspense>
        ))}
      </Suspense>
      <article className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <Suspense fallback={<ThreadHeaderSkeleton />}>
            {query.then(({ threadId }) => (
              <AnimatedSuspense fallback={<ThreadHeaderSkeleton />}>
                <ThreadHeader threadId={threadId}>
                  <ErrorBoundary title="This conversation could not be loaded">
                    <AnimatedSuspense fallback={<LatestMessageSkeleton />}>
                      <LatestMessage threadId={threadId} />
                      <AnimatedSuspense fallback={<EarlierMessagesSkeleton />}>
                        <EarlierMessages threadId={threadId} />
                      </AnimatedSuspense>
                    </AnimatedSuspense>
                  </ErrorBoundary>
                </ThreadHeader>
              </AnimatedSuspense>
            ))}
          </Suspense>
        </div>
      </article>
    </div>
  );
}
