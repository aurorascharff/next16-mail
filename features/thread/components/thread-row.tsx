'use client';

import { Archive, ArchiveRestore, Check, Paperclip, Star } from 'lucide-react';
import { startTransition, useOptimistic } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { actionToast } from '@/components/ui/action-toast';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { cn } from '@/lib/utils';
import { moveThread, toggleStar } from '../thread-actions';
import { LabelChip } from './label-chip';
import { RowButton } from './row-button';
import { useRowSelection } from './selection';
import { ThreadTime } from './thread-time';
import type { Mailbox } from '../thread-mailboxes';
import type { ThreadListItem } from '../types/thread';
import type { Route } from 'next';

export function ThreadRow({ href, mailbox, thread }: { href: Route; mailbox?: Mailbox; thread: ThreadListItem }) {
  const [state, setState] = useOptimistic({ mailbox: thread.mailbox, starred: thread.starred });
  const { selected, toggle } = useRowSelection({ id: thread.id, read: thread.read, starred: state.starred });
  const canMove = mailbox === 'inbox' || mailbox === 'archive';
  const leaving = canMove && state.mailbox !== mailbox;
  const sender = thread.participants.at(-1) ?? '';
  const emphasis = thread.read ? 'text-black/70 dark:text-white/70' : 'font-bold text-black dark:text-white';

  function star() {
    startTransition(async () => {
      setState({ ...state, starred: !state.starred });
      const result = await toggleStar(thread.id, !state.starred);
      if (!result.ok) toast.error(result.error);
    });
  }

  function move() {
    const target = state.mailbox === 'archive' ? 'inbox' : 'archive';
    startTransition(async () => {
      setState({ ...state, mailbox: target });
      const result = await moveThread(thread.id, target);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      actionToast(target === 'archive' ? 'Conversation archived' : 'Conversation moved to inbox', {
        label: 'Undo',
        run: () => moveThread(thread.id, target === 'archive' ? 'inbox' : 'archive'),
      });
    });
  }

  return (
    <Boundary label="ThreadRow" asChild>
      <li
        className={cn(
          'group border-divider/70 dark:border-divider-dark/70 relative grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-3 border-b px-4 py-3 transition-[background-color,opacity] duration-200 data-removing:opacity-40 sm:px-5',
          selected
            ? 'bg-accent/10 dark:bg-accent/15'
            : thread.read
              ? 'bg-card/60 hover:bg-card dark:bg-card-dark/70 dark:hover:bg-card-dark'
              : 'hover:bg-card/40 dark:hover:bg-card-dark/40',
        )}
        data-read={thread.read ? '' : undefined}
        data-removing={leaving ? '' : undefined}
        data-selected={selected ? '' : undefined}
        data-testid="thread-row"
      >
        <PrefetchLink
          aria-label={thread.subject}
          className="focus-visible:ring-accent/40 absolute inset-0 z-10 outline-none focus-visible:ring-2 focus-visible:ring-inset"
          href={href}
        />
        <button
          aria-checked={selected}
          aria-label={`Select ${thread.subject}`}
          className="group/select focus-visible:ring-accent/40 relative z-20 flex size-9 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
          onClick={toggle}
          role="checkbox"
          type="button"
        >
          <span className={cn('absolute inset-0', selected ? 'invisible' : 'group-hover/select:invisible')}>
            <UserAvatar name={sender === 'me' ? 'Me' : sender} />
          </span>
          <span
            className={cn(
              'flex size-7 items-center justify-center rounded-full border',
              selected
                ? 'border-accent bg-accent text-white'
                : 'border-gray/50 bg-card dark:bg-card-dark invisible text-transparent group-hover/select:visible',
            )}
          >
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        </button>
        <div className="flex min-w-0 flex-col">
          <div className="flex h-5 items-center gap-1.5">
            <span className={cn('truncate text-sm', emphasis, !thread.read && 'tracking-tight')}>
              {thread.participants.join(', ')}
            </span>
            {thread.messageCount > 1 ? (
              <span className="text-gray text-xs tabular-nums">{thread.messageCount}</span>
            ) : null}
            <ThreadTime
              className={cn(
                'ml-auto shrink-0 text-xs tabular-nums',
                thread.read ? 'text-gray' : 'font-bold text-black dark:text-white',
              )}
              iso={thread.updatedAt}
            />
          </div>
          <div className={cn('h-5 truncate text-sm leading-5', emphasis)}>{thread.subject}</div>
          <div className="flex h-5 items-center gap-2">
            {thread.labels.map(label => (
              <LabelChip className="hidden xl:inline-flex" key={label.id} label={label} />
            ))}
            {thread.hasAttachments ? (
              <Paperclip aria-label="Has attachments" className="text-gray size-3.5 shrink-0" />
            ) : null}
            <span className="text-gray min-w-0 flex-1 truncate text-[13px]">{thread.snippet}</span>
            <span className="relative z-20 flex shrink-0 items-center gap-1">
              {state.mailbox === 'sent' ? null : (
                <RowButton
                  className="invisible group-focus-within:visible group-hover:visible"
                  label={state.mailbox === 'archive' ? 'Move to inbox' : 'Archive'}
                  onClick={move}
                >
                  {state.mailbox === 'archive' ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
                </RowButton>
              )}
              <RowButton
                active={state.starred}
                className={cn(!state.starred && 'invisible group-focus-within:visible group-hover:visible')}
                label={state.starred ? 'Remove star' : 'Star'}
                onClick={star}
              >
                <Star className={cn('size-4', state.starred && 'fill-current')} strokeWidth={1.5} />
              </RowButton>
            </span>
          </div>
        </div>
      </li>
    </Boundary>
  );
}
