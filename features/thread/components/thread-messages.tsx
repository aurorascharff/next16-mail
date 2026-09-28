import { Skeleton } from '@/components/ui/skeleton';
import { getContacts, getThreadMessages } from '../thread-queries';
import { Attachments, MessageText, MessageTextSkeleton, SenderRow, SenderRowSkeleton } from './message-body';
import { ReplyForm } from './reply-form';

export async function ThreadMessages({ threadId }: { threadId: string }) {
  const [messages, contacts] = await Promise.all([getThreadMessages(threadId), getContacts()]);
  const [latest, ...earlier] = messages;
  if (!latest) return null;

  return (
    <div data-testid="thread-messages">
      <article data-testid="thread-latest">
        <MessageText paragraphs={latest.paragraphs} />
        <Attachments attachments={latest.attachments} />
      </article>
      <ReplyForm contacts={contacts} threadId={threadId} to={latest.from.name.split(' ')[0]} />
      {earlier.length > 0 ? (
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
      ) : null}
    </div>
  );
}

export function ThreadMessagesSkeleton() {
  return (
    <div aria-hidden>
      <MessageTextSkeleton lines={9} />
      <Skeleton className="skeleton-subtle mt-8 h-24 rounded-md" />
      <div className="border-divider/70 dark:border-divider-dark/70 mt-10 border-t pt-8">
        <SenderRowSkeleton />
        <div className="mt-4">
          <MessageTextSkeleton lines={4} />
        </div>
      </div>
    </div>
  );
}
