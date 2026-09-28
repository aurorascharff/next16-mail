import { Suspense } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { ThreadBody, ThreadBodySkeleton } from '@/features/thread/components/thread-body';
import { ThreadHeader, ThreadHeaderSkeleton } from '@/features/thread/components/thread-header';
import { isMailbox, type Mailbox } from '@/features/thread/thread-mailboxes';

// No `generateMetadata` here: reading `params` in it would keep the route's metadata out of the per-link prefetch,
// and the prefetch is the point of this page. The root layout's title covers the tab.
export default function ThreadPage({ params }: PageProps<'/[mailbox]/[threadId]'>) {
  const query = params.then(({ mailbox, threadId }) => ({
    mailbox: (isMailbox(mailbox) ? mailbox : 'inbox') as Mailbox,
    threadId,
  }));

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-5 sm:px-8 sm:py-6" data-reading-pane>
      <Suspense
        fallback={
          <>
            <ThreadHeaderSkeleton />
            <div className="mt-4">
              <ThreadBodySkeleton />
            </div>
          </>
        }
      >
        {query.then(({ mailbox, threadId }) => (
          <>
            {/* Prefetch stage: a hovered row resolves the header before the click. */}
            <AnimatedSuspense fallback={<ThreadHeaderSkeleton />} key={`header-${threadId}`}>
              <ThreadHeader mailbox={mailbox} threadId={threadId} />
            </AnimatedSuspense>
            {/* Navigation stage: `await navigation()` in the query holds the body back until the thread opens. */}
            <div className="mt-4">
              <ErrorBoundary title="The rest of this conversation could not be loaded">
                <AnimatedSuspense fallback={<ThreadBodySkeleton />} key={`body-${threadId}`}>
                  <ThreadBody threadId={threadId} />
                </AnimatedSuspense>
              </ErrorBoundary>
            </div>
          </>
        ))}
      </Suspense>
    </article>
  );
}
