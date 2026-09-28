import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { MailSplit } from '@/components/mail-split';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { ThreadList, ThreadListSkeleton } from '@/features/thread/components/thread-list';
import { isMailbox } from '@/features/thread/thread-mailboxes';

export default function MailboxLayout({ children, params }: LayoutProps<'/[mailbox]'>) {
  const mailbox = params.then(({ mailbox }) => {
    if (!isMailbox(mailbox)) notFound();
    return mailbox;
  });

  return (
    <MailSplit
      list={
        <>
          <div className="thread-results min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <Suspense fallback={<ThreadListSkeleton />}>
              {mailbox.then(value => (
                <AnimatedSuspense fallback={<ThreadListSkeleton />}>
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
