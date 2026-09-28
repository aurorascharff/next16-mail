import { Archive, Inbox, Send, Star, type LucideIcon } from 'lucide-react';
import { NavLink } from '@/components/ui/nav-link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { MAILBOX_LABELS, MAILBOXES, type Mailbox } from '../thread-mailboxes';
import { getMailboxCounts } from '../thread-queries';
import type { MailboxCounts } from '../types/thread';

const icons: Record<Mailbox, LucideIcon> = { archive: Archive, inbox: Inbox, sent: Send, starred: Star };

const linkClass =
  'group flex h-10 items-center gap-3 rounded-lg px-3 text-base tracking-tight transition-colors not-aria-[current=page]:hover:bg-card dark:not-aria-[current=page]:hover:bg-card-dark aria-[current=page]:bg-accent/10 aria-[current=page]:text-accent aria-[current=page]:dark:bg-accent/15 aria-[current=page]:font-bold aria-[current=page]:[&_svg]:stroke-[2.5]';

export async function MailboxNav() {
  const counts = await getMailboxCounts();
  return <MailboxNavShell counts={counts} />;
}

export function MailboxNavSkeleton() {
  return <MailboxNavShell counts={null} />;
}

function MailboxNavShell({ counts }: { counts: MailboxCounts | null }) {
  return (
    <nav aria-label="Mailboxes" className="flex flex-col gap-0.5">
      {MAILBOXES.map(mailbox => {
        const Icon = icons[mailbox];
        const count = counts?.[mailbox] ?? 0;
        return (
          <NavLink className={linkClass} href={`/${mailbox}`} key={mailbox} prefetch={true}>
            <Icon aria-hidden className="size-5 shrink-0" />
            <span className="flex-1">{MAILBOX_LABELS[mailbox]}</span>
            {counts === null ? (
              mailbox === 'archive' ? null : (
                <Skeleton className="skeleton-subtle h-5 w-7 rounded-full" />
              )
            ) : count > 0 ? (
              <span
                className={cn('text-gray group-aria-[current=page]:text-accent text-xs font-medium tabular-nums')}
                data-testid={`unread-${mailbox}`}
              >
                {count}
              </span>
            ) : null}
          </NavLink>
        );
      })}
    </nav>
  );
}
