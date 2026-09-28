import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { MailSplit } from '@/components/mail-split';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { ThreadList, ThreadListSkeleton } from '@/features/thread/components/thread-list';
import { ThreadListHeader } from '@/features/thread/components/thread-list-header';
import { isMailbox, MAILBOX_LABELS } from '@/features/thread/thread-mailboxes';

export default function MailboxLayout({ children, params }: LayoutProps<'/[mailbox]'>) {
  const mailbox = params.then(({ mailbox }) => {
    if (!isMailbox(mailbox)) notFound();
    return mailbox;
  });

  return (
    <MailSplit
      list={
        <>
          <Suspense fallback={<ThreadListHeader title="" />}>
            {mailbox.then(value => (
              <ThreadListHeader title={MAILBOX_LABELS[value]} />
            ))}
          </Suspense>
          <div className="thread-results min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <Suspense fallback={<ThreadListSkeleton />}>
              {mailbox.then(value => (
                <AnimatedSuspense fallback={<ThreadListSkeleton />} key={value}>
                  <ThreadList mailbox={value} />
                </AnimatedSuspense>
              ))}
            </Suspense>
          </div>
        </>
      }
    >
      {children}
    </MailSplit>
  );
}
