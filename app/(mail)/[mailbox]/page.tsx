import { notFound } from 'next/navigation';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { ComposeButton } from '@/features/thread/components/compose-button';
import { ThreadList, ThreadListSkeleton } from '@/features/thread/components/thread-list';
import { isMailbox, MAILBOX_LABELS, parsePage } from '@/features/thread/thread-mailboxes';

export default function MailboxPage({ params, searchParams }: PageProps<'/[mailbox]'>) {
  const query = Promise.all([params, searchParams]).then(([{ mailbox }, values]) => {
    if (!isMailbox(mailbox)) notFound();
    return { mailbox, page: parsePage(values.page) };
  });

  return (
    <>
      <div className="flex h-full flex-col" data-thread-list>
        <AnimatedSuspense fallback={<ThreadListSkeleton />}>
          {query.then(({ mailbox, page }) => (
            <ThreadList mailbox={mailbox} page={page} title={MAILBOX_LABELS[mailbox]} />
          ))}
        </AnimatedSuspense>
      </div>
      <ComposeButton variant="fab" />
    </>
  );
}
