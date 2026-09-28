import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import {
  ThreadList,
  ThreadListSkeleton,
  ThreadListToolbar,
  ThreadRowsSkeleton,
} from '@/features/thread/components/thread-list';
import { parseSelected } from '@/features/thread/thread-list-url';
import { isMailbox, MAILBOX_LABELS, parsePage } from '@/features/thread/thread-mailboxes';

export default function MailboxPage({ params, searchParams }: PageProps<'/[mailbox]'>) {
  const query = Promise.all([params, searchParams]).then(([{ mailbox }, values]) => {
    if (!isMailbox(mailbox)) notFound();
    return { mailbox, page: parsePage(values.page), selected: parseSelected(values.selected) };
  });

  return (
    <div className="thread-results h-full overflow-y-auto overscroll-y-contain" data-thread-list>
      <Suspense fallback={<ThreadListSkeleton />}>
        {query.then(({ mailbox, page, selected }) => (
          <>
            <ThreadListToolbar mailbox={mailbox} page={page} selected={selected} title={MAILBOX_LABELS[mailbox]} />
            <AnimatedSuspense fallback={<ThreadRowsSkeleton />}>
              <ThreadList mailbox={mailbox} page={page} selected={selected} />
            </AnimatedSuspense>
          </>
        ))}
      </Suspense>
    </div>
  );
}
