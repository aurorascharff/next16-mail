'use client';

import { Archive, ArchiveRestore, Paperclip, Star } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { startTransition, useOptimistic } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { cn } from '@/lib/utils';
import { moveThread, toggleStar } from '../thread-actions';
import { LabelChip } from './label-chip';
import { ThreadTime } from './thread-time';
import type { Mailbox } from '../thread-mailboxes';
import type { ThreadListItem } from '../types/thread';
import type { Route } from 'next';

type RowAction = { type: 'star'; id: string; starred: boolean } | { type: 'move'; id: string };

function threadReducer(threads: ThreadListItem[], action: RowAction) {
  switch (action.type) {
    case 'star':
      return threads.map(thread => (thread.id === action.id ? { ...thread, starred: action.starred } : thread));
    case 'move':
      return threads.filter(thread => thread.id !== action.id);
  }
}

/**
 * Rows for a mailbox or a search. The server hands over the list; this leaf owns only the optimistic
 * star and archive changes until the action settles and the server list replaces it.
 */
export function ThreadRows({ mailbox, threads }: { mailbox?: Mailbox; threads: ThreadListItem[] }) {
  const [optimisticThreads, dispatch] = useOptimistic(threads, threadReducer);
  const pathname = usePathname();
  const router = useRouter();

  function star(thread: ThreadListItem) {
    startTransition(async () => {
      dispatch({ id: thread.id, starred: !thread.starred, type: 'star' });
      const result = await toggleStar(thread.id, !thread.starred);
      if (!result.ok) toast.error(result.error);
    });
  }

  function move(thread: ThreadListItem, href: string) {
    const target = thread.mailbox === 'archive' ? 'inbox' : 'archive';
    startTransition(async () => {
      if (mailbox === 'inbox' || mailbox === 'archive') dispatch({ id: thread.id, type: 'move' });
      const result = await moveThread(thread.id, target);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (pathname === href && mailbox) router.push(`/${mailbox}` as Route);
    });
  }

  return (
    <Boundary label="ThreadRows" asChild>
      <ul aria-label="Conversations" className="flex flex-col" data-testid="thread-rows">
        {optimisticThreads.map(thread => {
          const href = `/${mailbox ?? thread.mailbox}/${thread.id}` as Route;
          const active = pathname === href;
          const sender = thread.participants.at(-1) ?? '';
          return (
            <li
              className={cn(
                'group border-divider/60 dark:border-divider-dark/60 relative border-b transition-colors',
                active ? 'bg-accent-fade' : 'hover:bg-card dark:hover:bg-card-dark',
              )}
              data-read={thread.read ? '' : undefined}
              data-testid="thread-row"
              key={thread.id}
            >
              <HoverPrefetchLink
                aria-current={active ? 'page' : undefined}
                className="focus-visible:ring-accent/40 grid grid-cols-[2.25rem_minmax(0,1fr)_auto] gap-x-3 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-inset"
                href={href}
              >
                <UserAvatar name={sender === 'me' ? 'Me' : sender} />
                <span className="flex min-w-0 flex-col">
                  <span
                    className={cn(
                      'flex h-5 items-center gap-1.5 truncate text-sm',
                      thread.read ? 'text-muted' : 'font-semibold text-black dark:text-white',
                    )}
                  >
                    {!thread.read ? (
                      <span aria-label="Unread" className="bg-accent size-1.5 shrink-0 rounded-full" />
                    ) : null}
                    <span className="truncate">{thread.participants.join(', ')}</span>
                    {thread.messageCount > 1 ? (
                      <span className="text-muted text-xs font-normal tabular-nums">{thread.messageCount}</span>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      'flex h-5 items-center gap-2 truncate text-sm',
                      thread.read ? 'text-black/80 dark:text-white/80' : 'font-medium text-black dark:text-white',
                    )}
                  >
                    <span className="truncate">{thread.subject}</span>
                    {thread.labels.map(label => (
                      <LabelChip className="hidden xl:inline-flex" key={label.id} label={label} />
                    ))}
                  </span>
                  <span className="text-muted flex h-5 items-center truncate text-[13px]">{thread.snippet}</span>
                </span>
                <span className="flex flex-col items-end gap-1">
                  <ThreadTime
                    className={cn(
                      'h-5 text-xs leading-5 tabular-nums group-hover:invisible',
                      thread.read ? 'text-muted' : 'text-accent font-semibold',
                    )}
                    iso={thread.updatedAt}
                  />
                  <span className="text-muted flex h-5 items-center gap-1.5">
                    {thread.hasAttachments ? <Paperclip aria-label="Has attachments" className="size-3.5" /> : null}
                    {thread.starred ? (
                      <Star aria-label="Starred" className="text-warning size-3.5 fill-current" />
                    ) : null}
                  </span>
                </span>
              </HoverPrefetchLink>
              <span className="absolute top-2.5 right-3 hidden items-center gap-0.5 group-focus-within:flex group-hover:flex">
                <RowButton
                  active={thread.starred}
                  label={thread.starred ? 'Remove star' : 'Star'}
                  onClick={() => star(thread)}
                >
                  <Star className={cn('size-4', thread.starred && 'fill-current')} />
                </RowButton>
                {thread.mailbox === 'sent' ? null : (
                  <RowButton
                    label={thread.mailbox === 'archive' ? 'Move to inbox' : 'Archive'}
                    onClick={() => move(thread, href)}
                  >
                    {thread.mailbox === 'archive' ? (
                      <ArchiveRestore className="size-4" />
                    ) : (
                      <Archive className="size-4" />
                    )}
                  </RowButton>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </Boundary>
  );
}

function RowButton({
  active,
  children,
  label,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'bg-elevated dark:bg-elevated-dark border-divider dark:border-divider-dark text-muted inline-flex size-7 items-center justify-center rounded-full border shadow-sm transition-colors hover:text-black dark:hover:text-white',
        active && 'text-warning hover:text-warning',
      )}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}
