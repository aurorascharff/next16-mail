import { Archive, Inbox, Send, Star, type LucideIcon } from 'lucide-react';
import { NavLink } from '@/components/ui/nav-link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { MAILBOX_LABELS, MAILBOXES, type Mailbox } from '../thread-mailboxes';
import { getMailboxCounts } from '../thread-queries';
import type { MailboxCounts } from '../types/thread';

const icons: Record<Mailbox, LucideIcon> = { archive: Archive, inbox: Inbox, sent: Send, starred: Star };

const linkClass =
  'group flex h-9 items-center gap-3 rounded-full pr-2 pl-3 text-sm font-medium transition-colors text-muted hover:bg-card hover:text-black dark:hover:bg-card-dark dark:hover:text-white aria-[current=page]:bg-accent-fade aria-[current=page]:text-accent aria-[current=page]:font-semibold';

/** Mailbox links with unread counts. Session data only, so the App Shell carries it for every route. */
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
            <Icon aria-hidden className="size-4 shrink-0" strokeWidth={2} />
            <span className="flex-1">{MAILBOX_LABELS[mailbox]}</span>
            {counts === null ? (
              mailbox === 'archive' ? null : (
                <Skeleton className="skeleton-subtle h-5 w-7 rounded-full" />
              )
            ) : count > 0 ? (
              <span
                className={cn(
                  'bg-card dark:bg-card-dark text-muted group-aria-[current=page]:bg-accent flex h-5 min-w-7 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums group-aria-[current=page]:text-white',
                )}
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
