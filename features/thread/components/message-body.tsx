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
import { UserAvatar } from '@/features/user/components/user-avatar';
import { formatBytes, formatFullDate } from '@/lib/utils';
import type { Attachment, Participant } from '../types/thread';

export function SenderRow({ date, from, to }: { date: string; from: Participant; to: Participant[] }) {
  return (
    <div className="flex h-11 items-center gap-3">
      <UserAvatar name={from.name} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="flex h-5 items-baseline gap-1.5 text-sm">
          <span className="truncate font-semibold tracking-tight">{from.name}</span>
          <span className="text-gray hidden truncate text-[13px] sm:inline">{from.email}</span>
        </p>
        <p className="text-gray flex h-5 items-center truncate text-[13px]">
          to {to.map(person => person.name.split(' ')[0]).join(', ') || 'me'}
        </p>
      </div>
      <time className="text-gray shrink-0 text-xs tabular-nums" dateTime={date}>
        {formatFullDate(new Date(date))}
      </time>
    </div>
  );
}

export function MessageText({ paragraphs }: { paragraphs: string[] }) {
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

export function Attachments({ attachments }: { attachments: Attachment[] }) {
  if (attachments.length === 0) return null;
  return (
    <ul aria-label="Attachments" className="mt-6 flex flex-wrap gap-2">
      {attachments.map(attachment => {
        const Icon = attachmentIcons[attachment.type] ?? File;
        return (
          <li
            className="border-divider bg-card/40 dark:border-divider-dark dark:bg-card-dark/40 flex h-12 items-center gap-3 rounded-xl border px-3"
            key={attachment.id}
          >
            <Icon className="text-accent size-4 shrink-0" />
            <span className="flex flex-col">
              <span className="max-w-48 truncate text-xs font-medium">{attachment.name}</span>
              <span className="text-gray text-[11px] tabular-nums">{formatBytes(attachment.size)}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function SenderRowSkeleton() {
  return (
    <div className="flex h-11 items-center gap-3">
      <Skeleton className="skeleton-subtle size-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="skeleton-subtle h-3 w-20" />
      </div>
    </div>
  );
}

export function MessageTextSkeleton({ lines = 3 }: { lines?: number }) {
  const widths = ['w-full', 'w-11/12', 'w-2/3'];
  return (
    <div className="flex max-w-[68ch] flex-col">
      {Array.from({ length: lines }).map((_, index) => (
        <span className="flex h-6 items-center" key={index}>
          <Skeleton className={`skeleton-subtle h-3 ${widths[index % widths.length]}`} />
        </span>
      ))}
    </div>
  );
}
