import { notFound } from 'next/navigation';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { ComposeButton } from '@/features/thread/components/compose-button';
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
    <>
      <div className="flex h-full flex-col" data-thread-list>
        <AnimatedSuspense fallback={<ThreadListSkeleton />}>
          {query.then(({ mailbox, page }) => (
            <SelectionProvider list={`${mailbox}:${page}`}>
              <ThreadListHeaderFor mailbox={mailbox} page={page} title={MAILBOX_LABELS[mailbox]} />
              <div
                className="thread-results min-h-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]"
                key={`${mailbox}:${page}`}
              >
                <AnimatedSuspense fallback={<ThreadRowsSkeleton />}>
                  <ThreadList mailbox={mailbox} page={page} />
                </AnimatedSuspense>
              </div>
            </SelectionProvider>
          ))}
        </AnimatedSuspense>
      </div>
      <ComposeButton variant="fab" />
    </>
  );
}
