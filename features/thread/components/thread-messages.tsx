import { Skeleton } from '@/components/ui/skeleton';
import { getContacts, getEarlierMessages, getLatestMessage, getThreadSummary } from '../thread-queries';
import { Attachments, MessageText, MessageTextSkeleton, SenderRow, SenderRowSkeleton } from './message-body';
import { ReplyForm } from './reply-form';

// The body sets the height of everything below it, so the reply form and earlier messages render as children
// and only stream in once the body is on screen.
export async function LatestMessage({ children, threadId }: { children: React.ReactNode; threadId: string }) {
  const latest = await getLatestMessage(threadId);
  if (!latest) return null;

  return (
    <>
      <article data-testid="thread-latest">
        <MessageText paragraphs={latest.paragraphs} />
        <Attachments attachments={latest.attachments} />
      </article>
      {children}
    </>
  );
}

export function LatestMessageSkeleton() {
  return <MessageTextSkeleton className="h-48" />;
}

export async function ThreadReply({ threadId }: { threadId: string }) {
  const [thread, contacts] = await Promise.all([getThreadSummary(threadId), getContacts()]);
  return <ReplyForm contacts={contacts} threadId={threadId} to={thread.latest.from.name.split(' ')[0]} />;
}

export function ThreadReplySkeleton() {
  return <Skeleton className="mt-8 h-24 rounded-md" />;
}

export async function EarlierMessages({ threadId }: { threadId: string }) {
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
