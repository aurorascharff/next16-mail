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

type RowAction = { type: 'star'; id: string; starred: boolean } | { type: 'move'; id: string; mailbox: string };

function threadReducer(threads: ThreadListItem[], action: RowAction) {
  switch (action.type) {
    case 'star':
      return threads.map(thread => (thread.id === action.id ? { ...thread, starred: action.starred } : thread));
    case 'move':
      return threads.map(thread => (thread.id === action.id ? { ...thread, mailbox: action.mailbox } : thread));
  }
}

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
      dispatch({ id: thread.id, mailbox: target, type: 'move' });
      const result = await moveThread(thread.id, target);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (pathname === href && mailbox && mailbox !== 'starred' && mailbox !== 'sent')
        router.push(`/${mailbox}` as Route);
    });
  }

  return (
    <Boundary label="ThreadRows" asChild>
      <ul aria-label="Conversations" className="flex flex-col" data-testid="thread-rows">
        {optimisticThreads.map(thread => {
          const href = `/${mailbox ?? thread.mailbox}/${thread.id}` as Route;
          const active = pathname === href;
          const sender = thread.participants.at(-1) ?? '';
          const leaving = (mailbox === 'inbox' || mailbox === 'archive') && thread.mailbox !== mailbox;
          return (
            <li
              className={cn(
                'group border-divider/70 dark:border-divider-dark/70 relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-b px-4 py-3 transition-[background-color,opacity] duration-200 data-removing:opacity-40 sm:px-5',
                active ? 'bg-accent/10 dark:bg-accent/15' : 'hover:bg-card/60 dark:hover:bg-card-dark/60',
              )}
              data-read={thread.read ? '' : undefined}
              data-removing={leaving ? '' : undefined}
              data-testid="thread-row"
              key={thread.id}
            >
              <HoverPrefetchLink
                aria-current={active ? 'page' : undefined}
                aria-label={thread.subject}
                className="focus-visible:ring-accent/40 absolute inset-0 z-10 outline-none focus-visible:ring-2 focus-visible:ring-inset"
                href={href}
              />
              <UserAvatar name={sender === 'me' ? 'Me' : sender} />
              <div className="flex min-w-0 flex-col">
                <div className="flex h-5 items-center gap-1.5">
                  {!thread.read ? (
                    <span aria-label="Unread" className="bg-accent size-1.5 shrink-0 rounded-full" />
                  ) : null}
                  <span
                    className={cn(
                      'truncate text-sm',
                      thread.read ? 'text-gray' : 'font-semibold tracking-tight text-black dark:text-white',
                    )}
                  >
                    {thread.participants.join(', ')}
                  </span>
                  {thread.messageCount > 1 ? (
                    <span className="text-gray text-xs tabular-nums">{thread.messageCount}</span>
                  ) : null}
                  <ThreadTime
                    className={cn(
                      'ml-auto shrink-0 text-xs tabular-nums',
                      thread.read ? 'text-gray' : 'text-accent font-semibold',
                    )}
                    iso={thread.updatedAt}
                  />
                </div>
                <div
                  className={cn(
                    'h-5 truncate text-sm leading-5',
                    thread.read ? 'text-black/80 dark:text-white/80' : 'font-medium text-black dark:text-white',
                  )}
                >
                  {thread.subject}
                </div>
                <div className="flex h-5 items-center gap-2">
                  <span className="text-gray min-w-0 flex-1 truncate text-[13px]">{thread.snippet}</span>
                  <span className="relative z-20 flex shrink-0 items-center gap-1">
                    {thread.labels.map(label => (
                      <LabelChip className="hidden xl:inline-flex" key={label.id} label={label} />
                    ))}
                    {thread.hasAttachments ? (
                      <Paperclip aria-label="Has attachments" className="text-gray mx-1 size-3.5" />
                    ) : null}
                    {thread.mailbox === 'sent' ? null : (
                      <RowButton
                        className="invisible group-focus-within:visible group-hover:visible"
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
                    <RowButton
                      active={thread.starred}
                      className={cn(!thread.starred && 'invisible group-focus-within:visible group-hover:visible')}
                      label={thread.starred ? 'Remove star' : 'Star'}
                      onClick={() => star(thread)}
                    >
                      <Star className={cn('size-4', thread.starred && 'fill-current')} />
                    </RowButton>
                  </span>
                </div>
              </div>
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
  className,
  label,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'text-gray inline-flex size-6 items-center justify-center rounded-full transition-colors hover:bg-black/5 hover:text-black dark:hover:bg-white/10 dark:hover:text-white',
        active && 'text-accent hover:text-accent',
        className,
      )}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}
