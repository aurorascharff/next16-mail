import { Suspense } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { ThreadHeader, ThreadHeaderSkeleton } from '@/features/thread/components/thread-header';
import { ThreadMessages, ThreadMessagesSkeleton } from '@/features/thread/components/thread-messages';
import { isMailbox, type Mailbox } from '@/features/thread/thread-mailboxes';

export default function ThreadPage({ params }: PageProps<'/[mailbox]/[threadId]'>) {
  const query = params.then(({ mailbox, threadId }) => ({
    mailbox: (isMailbox(mailbox) ? mailbox : 'inbox') as Mailbox,
    threadId,
  }));

  return (
    <article className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-8" data-reading-pane>
      <Suspense fallback={<ThreadHeaderSkeleton />}>
        {query.then(({ mailbox, threadId }) => (
          <AnimatedSuspense fallback={<ThreadHeaderSkeleton />}>
            <ThreadHeader mailbox={mailbox} threadId={threadId}>
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
