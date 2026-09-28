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
    <div aria-hidden>
      <SenderRowSkeleton />
      <div className="mt-4">
        <MessageTextSkeleton />
      </div>
    </div>
  );
}
