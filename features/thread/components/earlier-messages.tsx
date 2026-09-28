import { getEarlierMessages } from '../thread-queries';
import { Attachments, MessageText, MessageTextSkeleton, SenderRow, SenderRowSkeleton } from './message-body';

export async function EarlierMessages({ threadId }: { threadId: string }) {
  const messages = await getEarlierMessages(threadId);

  return (
    <ol className="flex flex-col gap-8" data-testid="thread-earlier">
      {messages.map(message => (
        <li
          className="border-divider/70 dark:border-divider-dark/70 border-b pb-8 last:border-b-0 last:pb-0"
          data-testid="earlier-message"
          key={message.id}
        >
          <article>
            <SenderRow date={message.sentAt} from={message.from} to={message.to} />
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

export function EarlierMessagesSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div aria-hidden className="flex flex-col gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="border-divider/70 dark:border-divider-dark/70 border-b pb-8 last:border-b-0 last:pb-0"
          key={index}
        >
          <SenderRowSkeleton />
          <div className="mt-4">
            <MessageTextSkeleton animate={index === 0} lines={3} />
          </div>
        </div>
      ))}
    </div>
  );
}
