import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { SelectionProvider } from '@/features/thread/components/selection';
import {
  ThreadList,
  ThreadListHeaderFor,
  ThreadListSkeleton,
  ThreadRowsSkeleton,
} from '@/features/thread/components/thread-list';
import { isMailbox, MAILBOX_LABELS, parsePage } from '@/features/thread/thread-mailboxes';

export default function MailboxPage({ params, searchParams }: PageProps<'/[mailbox]'>) {
  const query = Promise.all([params, searchParams]).then(([{ mailbox }, values]) => {
    if (!isMailbox(mailbox)) notFound();
    return { mailbox, page: parsePage(values.page) };
  });

  return (
    <div className="h-full overflow-y-auto overscroll-y-contain" data-thread-list>
      <Suspense fallback={<ThreadListSkeleton />}>
        {query.then(({ mailbox, page }) => (
          <SelectionProvider key={`${mailbox}:${page}`}>
            <ThreadListHeaderFor mailbox={mailbox} page={page} title={MAILBOX_LABELS[mailbox]} />
            <div className="thread-results">
              <AnimatedSuspense fallback={<ThreadRowsSkeleton />}>
                <ThreadList mailbox={mailbox} page={page} />
              </AnimatedSuspense>
            </div>
          </SelectionProvider>
        ))}
      </Suspense>
    </div>
  );
}
