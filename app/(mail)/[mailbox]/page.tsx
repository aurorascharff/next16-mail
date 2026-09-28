import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { ThreadList, ThreadListSkeleton } from '@/features/thread/components/thread-list';
import { isMailbox, MAILBOX_LABELS } from '@/features/thread/thread-mailboxes';

export default function MailboxPage({ params }: PageProps<'/[mailbox]'>) {
  const mailbox = params.then(({ mailbox }) => {
    if (!isMailbox(mailbox)) notFound();
    return mailbox;
  });

  return (
    <div className="thread-results h-full overflow-y-auto overscroll-contain" data-thread-list>
      <Suspense fallback={<ThreadListSkeleton />}>
        {mailbox.then(value => (
          <AnimatedSuspense fallback={<ThreadListSkeleton title={MAILBOX_LABELS[value]} />}>
            <ThreadList mailbox={value} />
          </AnimatedSuspense>
        ))}
      </Suspense>
    </div>
  );
}
