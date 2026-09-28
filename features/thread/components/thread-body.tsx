import {
  File,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Image as ImageIcon,
  type LucideIcon,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatBytes } from '@/lib/utils';
import { getThreadMessages } from '../thread-queries';
import { ReplyForm } from './reply-form';
import { SenderRow } from './thread-header';
import type { Attachment, ThreadMessage } from '../types/thread';

/**
 * The rest of the conversation: the remaining paragraphs of the latest message, its attachments, and every earlier
 * message. `getThreadMessages` awaits `unstable_navigation()`, so none of this is produced by a prefetch, only when
 * the thread is actually opened, and then cached for the next visitor.
 */
export async function ThreadBody({ threadId }: { threadId: string }) {
  const messages = await getThreadMessages(threadId);
  const latest = messages.at(-1)!;
  const earlier = messages.slice(0, -1).reverse();

  return (
    <div data-testid="thread-body">
      <MessageText paragraphs={latest.paragraphs.slice(1)} />
      <Attachments attachments={latest.attachments} />
      {earlier.length > 0 ? (
        <details className="border-divider dark:border-divider-dark group mt-8 border-t pt-4">
          <summary className="text-muted hover:text-accent inline-flex cursor-pointer list-none items-center gap-2 text-sm font-medium select-none [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">
              Show {earlier.length === 1 ? '1 earlier message' : `${earlier.length} earlier messages`}
            </span>
            <span className="hidden group-open:inline">Hide earlier messages</span>
          </summary>
          <ol className="mt-2 flex flex-col">
            {earlier.map(message => (
              <li
                className="border-divider/60 dark:border-divider-dark/60 border-b pb-6 last:border-b-0"
                key={message.id}
              >
                <EarlierMessage message={message} />
              </li>
            ))}
          </ol>
        </details>
      ) : null}
      <ReplyForm threadId={threadId} to={latest.from.name.split(' ')[0]} />
    </div>
  );
}

function EarlierMessage({ message }: { message: ThreadMessage }) {
  return (
    <article>
      <SenderRow date={message.sentAt} from={message.from} to={message.to} />
      <div className="mt-4">
        <MessageText paragraphs={message.paragraphs} />
      </div>
      <Attachments attachments={message.attachments} />
    </article>
  );
}

function MessageText({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) return null;
  return (
    <div className="flex max-w-[68ch] flex-col gap-4 text-[15px] leading-[1.65] text-black/85 dark:text-white/85">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

const attachmentIcons: Record<string, LucideIcon> = {
  code: FileCode,
  document: FileText,
  image: ImageIcon,
  spreadsheet: FileSpreadsheet,
  video: FileVideo,
};

function Attachments({ attachments }: { attachments: Attachment[] }) {
  if (attachments.length === 0) return null;
  return (
    <ul aria-label="Attachments" className="mt-6 flex flex-wrap gap-2">
      {attachments.map(attachment => {
        const Icon = attachmentIcons[attachment.type] ?? File;
        return (
          <li
            className="border-divider dark:border-divider-dark bg-surface dark:bg-surface-dark flex h-12 items-center gap-3 rounded-lg border px-3"
            key={attachment.id}
          >
            <Icon className="text-accent size-4 shrink-0" />
            <span className="flex flex-col">
              <span className="max-w-48 truncate text-xs font-medium">{attachment.name}</span>
              <span className="text-muted text-[11px] tabular-nums">{formatBytes(attachment.size)}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function ThreadBodySkeleton() {
  return (
    <div aria-hidden className="flex max-w-[68ch] flex-col gap-4">
      {[0, 1].map(block => (
        <div className="flex flex-col" key={block}>
          {['w-full', 'w-11/12', 'w-full', 'w-3/4'].map((width, line) => (
            <span className="flex h-6 items-center" key={line}>
              <Skeleton className={`${width} h-3.5 ${block > 0 || line > 1 ? 'skeleton-subtle' : ''}`} />
            </span>
          ))}
        </div>
      ))}
      <Skeleton className="skeleton-subtle mt-2 h-12 w-56 rounded-lg" />
    </div>
  );
}
