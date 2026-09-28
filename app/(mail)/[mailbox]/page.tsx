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
    <div className="flex h-full flex-col" data-thread-list>
      <Suspense fallback={<ThreadListSkeleton />}>
        {query.then(({ mailbox, page }) => (
          <SelectionProvider list={`${mailbox}:${page}`}>
            <ThreadListHeaderFor mailbox={mailbox} page={page} title={MAILBOX_LABELS[mailbox]} />
            <div className="thread-results min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
              <AnimatedSuspense fallback={<ThreadRowsSkeleton />} key={`${mailbox}:${page}`}>
                <ThreadList mailbox={mailbox} page={page} />
              </AnimatedSuspense>
            </div>
          </SelectionProvider>
        ))}
      </Suspense>
    </div>
  );
}
