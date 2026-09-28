import { unstable_navigation } from 'next/cache';
import { Skeleton } from '@/components/ui/skeleton';
import { getContacts, getEarlierMessages, getLatestMessage } from '../thread-queries';
import { Attachments, MessageText, MessageTextSkeleton, SenderRow, SenderRowSkeleton } from './message-body';
import { ReplyForm } from './reply-form';

export async function LatestMessage({ threadId }: { threadId: string }) {
  await unstable_navigation();
  const [latest, contacts] = await Promise.all([getLatestMessage(threadId), getContacts()]);
  if (!latest) return null;

  return (
    <>
      <article className="min-h-48" data-testid="thread-latest">
        <MessageText paragraphs={latest.paragraphs} />
        <Attachments attachments={latest.attachments} />
      </article>
      <ReplyForm contacts={contacts} threadId={threadId} to={latest.from.name.split(' ')[0]} />
    </>
  );
}

export function LatestMessageSkeleton() {
  return (
    <div aria-hidden>
      <MessageTextSkeleton className="min-h-48" />
      <div className="mt-8 h-43">
        <Skeleton className="h-24 rounded-md" />
      </div>
    </div>
  );
}

export async function EarlierMessages({ threadId }: { threadId: string }) {
  await unstable_navigation();
  const earlier = await getEarlierMessages(threadId);
  if (earlier.length === 0) return null;

  return (
    <ol
      className="border-divider/70 dark:border-divider-dark/70 mt-10 flex flex-col gap-8 border-t pt-8"
      data-testid="thread-earlier"
    >
      {earlier.map(message => (
        <li
          className="border-divider/70 dark:border-divider-dark/70 border-b pb-8 last:border-b-0 last:pb-0"
          data-testid="earlier-message"
          key={message.id}
        >
          <article>
            <SenderRow cc={message.cc} date={message.sentAt} from={message.from} to={message.to} />
            <div className="mt-4">
              <MessageText paragraphs={message.paragraphs} />
            </div>
            <Attachments attachments={message.attachments} />
          </article>
        </li>
      ))}
    </ol>
  );
}

export function EarlierMessagesSkeleton() {
  return (
    <div aria-hidden className="border-divider/70 dark:border-divider-dark/70 mt-10 border-t pt-8">
      <SenderRowSkeleton />
    </div>
  );
}
