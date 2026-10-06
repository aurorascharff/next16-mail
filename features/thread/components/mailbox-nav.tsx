import { Archive, Inbox, Send, Star, type LucideIcon } from 'lucide-react';
import { NavLink } from '@/components/ui/nav-link';
import { cn } from '@/lib/utils';
import { MAILBOX_LABELS, MAILBOXES, type Mailbox } from '../thread-mailboxes';
import { getMailboxCounts } from '../thread-queries';
import type { MailboxCounts } from '../types/thread';

const icons: Record<Mailbox, LucideIcon> = { archive: Archive, inbox: Inbox, sent: Send, starred: Star };

const linkClass =
  'group flex h-10 items-center gap-3 rounded-lg px-3 text-base tracking-tight transition-colors not-aria-[current=page]:hover:bg-card dark:not-aria-[current=page]:hover:bg-card-dark aria-[current=page]:bg-accent/10 aria-[current=page]:text-accent aria-[current=page]:dark:bg-accent/15 aria-[current=page]:font-bold aria-[current=page]:[&_svg]:stroke-[2.5]';

type Props = { prefetch?: boolean | 'auto' | null };

export async function MailboxNav({ prefetch = true }: Props) {
  const counts = await getMailboxCounts();
  return <MailboxNavShell counts={counts} prefetch={prefetch} />;
}

export function MailboxNavSkeleton({ prefetch = true }: Props) {
  return <MailboxNavShell counts={null} prefetch={prefetch} />;
}

function MailboxNavShell({ counts, prefetch }: { counts: MailboxCounts | null; prefetch: Props['prefetch'] }) {
  return (
    <nav aria-label="Mailboxes" className="flex flex-col gap-0.5">
      {MAILBOXES.map(mailbox => {
        const Icon = icons[mailbox];
        const count = counts?.[mailbox] ?? 0;
        return (
          <NavLink className={linkClass} href={`/${mailbox}`} key={mailbox} prefetch={prefetch}>
            <Icon aria-hidden className="size-5 shrink-0" />
            <span className="flex-1">{MAILBOX_LABELS[mailbox]}</span>
            {count > 0 ? (
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
