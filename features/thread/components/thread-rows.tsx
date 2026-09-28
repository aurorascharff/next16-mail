'use client';

import { Archive, ArchiveRestore, ChevronLeft, ChevronRight, MailOpen, Paperclip, Star, X } from 'lucide-react';
import { Check } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { startTransition, useOptimistic, useState } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { actionToast } from '@/components/ui/action-toast';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { cn } from '@/lib/utils';
import { markThreadsRead, moveThread, moveThreads, starThreads, toggleStar } from '../thread-actions';
import { LabelChip } from './label-chip';
import { ListTitle, ThreadListHeader } from './thread-list-header';
import { ThreadTime } from './thread-time';
import type { Mailbox } from '../thread-mailboxes';
import type { ThreadListItem } from '../types/thread';
import type { Route } from 'next';

type RowAction =
  | { type: 'star'; ids: string[]; starred: boolean }
  | { type: 'move'; ids: string[]; mailbox: string }
  | { type: 'read'; ids: string[]; read: boolean };

function threadReducer(threads: ThreadListItem[], action: RowAction) {
  const ids = new Set(action.ids);
  return threads.map(thread => {
    if (!ids.has(thread.id)) return thread;
    switch (action.type) {
      case 'star':
        return { ...thread, starred: action.starred };
      case 'move':
        return { ...thread, mailbox: action.mailbox };
      case 'read':
        return { ...thread, read: action.read };
    }
  });
}

type Pager = { base: string; page: number; pageSize: number; total: number };

export function ThreadRows({
  mailbox,
  pager,
  search,
  threads,
  title,
}: {
  mailbox?: Mailbox;
  pager: Pager;
  search?: string;
  threads: ThreadListItem[];
  title: string;
}) {
  const [optimisticThreads, dispatch] = useOptimistic(threads, threadReducer);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const router = useRouter();
  const visible = optimisticThreads;
  const start = (pager.page - 1) * pager.pageSize;
  const pageCount = Math.max(1, Math.ceil(pager.total / pager.pageSize));
  const chosen = visible.filter(thread => selected.has(thread.id));
  const canMove = mailbox === 'inbox' || mailbox === 'archive';

  function toggleSelected(id: string) {
    setSelected(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function star(thread: ThreadListItem) {
    startTransition(async () => {
      dispatch({ ids: [thread.id], starred: !thread.starred, type: 'star' });
      const result = await toggleStar(thread.id, !thread.starred);
      if (!result.ok) toast.error(result.error);
    });
  }

  function move(thread: ThreadListItem, href: string) {
    const target = thread.mailbox === 'archive' ? 'inbox' : 'archive';
    startTransition(async () => {
      dispatch({ ids: [thread.id], mailbox: target, type: 'move' });
      const result = await moveThread(thread.id, target);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (pathname === href && canMove) router.push(`/${mailbox}` as Route);
      actionToast(target === 'archive' ? 'Conversation archived' : 'Conversation moved to inbox', {
        label: 'Undo',
        run: () => moveThread(thread.id, thread.mailbox === 'archive' ? 'archive' : 'inbox'),
      });
    });
  }

  function moveChosen() {
    const ids = chosen.map(thread => thread.id);
    const target = mailbox === 'archive' ? 'inbox' : 'archive';
    setSelected(new Set());
    startTransition(async () => {
      dispatch({ ids, mailbox: target, type: 'move' });
      const result = await moveThreads(ids, target);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      actionToast(
        `${ids.length} ${ids.length === 1 ? 'conversation' : 'conversations'} ${target === 'archive' ? 'archived' : 'moved to inbox'}`,
        { label: 'Undo', run: () => moveThreads(ids, target === 'archive' ? 'inbox' : 'archive') },
      );
    });
  }

  function starChosen() {
    const ids = chosen.map(thread => thread.id);
    const starred = chosen.some(thread => !thread.starred);
    setSelected(new Set());
    startTransition(async () => {
      dispatch({ ids, starred, type: 'star' });
      const result = await starThreads(ids, starred);
      if (!result.ok) toast.error(result.error);
    });
  }

  function markChosen() {
    const ids = chosen.map(thread => thread.id);
    const read = chosen.some(thread => !thread.read);
    setSelected(new Set());
    startTransition(async () => {
      dispatch({ ids, read, type: 'read' });
      const result = await markThreadsRead(ids, read);
      if (!result.ok) toast.error(result.error);
    });
  }

  return (
    <Boundary label="ThreadRows">
      <ThreadListHeader
        leading={
          <>
            <RowCheckbox
              checked={chosen.length > 0 && chosen.length === visible.length}
              className="ml-2 size-5"
              label={chosen.length === visible.length ? 'Clear selection' : 'Select all on this page'}
              onChange={() =>
                setSelected(chosen.length === visible.length ? new Set() : new Set(visible.map(t => t.id)))
              }
            />
            {chosen.length > 0 ? (
              <>
                <span className="text-sm font-semibold tabular-nums">{chosen.length} selected</span>
                {canMove ? (
                  <RowButton label={mailbox === 'archive' ? 'Move to inbox' : 'Archive'} onClick={moveChosen}>
                    {mailbox === 'archive' ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
                  </RowButton>
                ) : null}
                <RowButton label={chosen.some(t => !t.starred) ? 'Star' : 'Remove star'} onClick={starChosen}>
                  <Star className="size-4" strokeWidth={1.5} />
                </RowButton>
                <RowButton label={chosen.some(t => !t.read) ? 'Mark as read' : 'Mark as unread'} onClick={markChosen}>
                  <MailOpen className="size-4" />
                </RowButton>
              </>
            ) : (
              <ListTitle>{title}</ListTitle>
            )}
          </>
        }
        trailing={
          chosen.length > 0 ? (
            <RowButton label="Clear selection" onClick={() => setSelected(new Set())}>
              <X className="size-4" />
            </RowButton>
          ) : (
            <>
              <span className="text-gray mr-1 text-xs tabular-nums">
                {start + 1}–{start + visible.length} of {pager.total}
              </span>
              <PagerLink disabled={pager.page <= 1} href={pageHref(pager, pager.page - 1)} label="Newer">
                <ChevronLeft className="size-4" />
              </PagerLink>
              <PagerLink disabled={pager.page >= pageCount} href={pageHref(pager, pager.page + 1)} label="Older">
                <ChevronRight className="size-4" />
              </PagerLink>
            </>
          )
        }
      />
      <ul aria-label="Conversations" className="flex flex-col" data-testid="thread-rows">
        {visible.map(thread => {
          const href = (
            search === undefined
              ? `/${mailbox ?? thread.mailbox}/${thread.id}`
              : `/search/${thread.id}?q=${encodeURIComponent(search)}`
          ) as Route;
          const active = pathname === href;
          const isSelected = selected.has(thread.id);
          const sender = thread.participants.at(-1) ?? '';
          const leaving = canMove && thread.mailbox !== mailbox;
          return (
            <li
              className={cn(
                'group border-divider/70 dark:border-divider-dark/70 relative grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-3 border-b px-4 py-3 transition-[background-color,opacity] duration-200 data-removing:opacity-40 sm:px-5',
                active || isSelected
                  ? 'bg-accent/10 dark:bg-accent/15'
                  : thread.read
                    ? 'bg-card/60 hover:bg-card dark:bg-card-dark/70 dark:hover:bg-card-dark'
                    : 'hover:bg-card/40 dark:hover:bg-card-dark/40',
              )}
              data-read={thread.read ? '' : undefined}
              data-removing={leaving ? '' : undefined}
              data-selected={isSelected ? '' : undefined}
              data-testid="thread-row"
              key={thread.id}
            >
              <HoverPrefetchLink
                aria-current={active ? 'page' : undefined}
                aria-label={thread.subject}
                className="focus-visible:ring-accent/40 absolute inset-0 z-10 outline-none focus-visible:ring-2 focus-visible:ring-inset"
                href={href}
              />
              <SelectAvatar
                checked={isSelected}
                label={`Select ${thread.subject}`}
                name={sender === 'me' ? 'Me' : sender}
                onChange={() => toggleSelected(thread.id)}
              />
              <div className="flex min-w-0 flex-col">
                <div className="flex h-5 items-center gap-1.5">
                  <span
                    className={cn(
                      'truncate text-sm',
                      thread.read
                        ? 'text-black/70 dark:text-white/70'
                        : 'font-bold tracking-tight text-black dark:text-white',
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
                      thread.read ? 'text-gray' : 'font-bold text-black dark:text-white',
                    )}
                    iso={thread.updatedAt}
                  />
                </div>
                <div
                  className={cn(
                    'h-5 truncate text-sm leading-5',
                    thread.read ? 'text-black/70 dark:text-white/70' : 'font-bold text-black dark:text-white',
                  )}
                >
                  {thread.subject}
                </div>
                <div className="flex h-5 items-center gap-2">
                  {thread.labels.map(label => (
                    <LabelChip className="hidden xl:inline-flex" key={label.id} label={label} />
                  ))}
                  {thread.hasAttachments ? (
                    <Paperclip aria-label="Has attachments" className="text-gray size-3.5 shrink-0" />
                  ) : null}
                  <span className="text-gray min-w-0 flex-1 truncate text-[13px]">{thread.snippet}</span>
                  <span className="relative z-20 flex shrink-0 items-center gap-1">
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
                      <Star className={cn('size-4', thread.starred && 'fill-current')} strokeWidth={1.5} />
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

function pageHref(pager: Pager, page: number) {
  return (page <= 1 ? pager.base : `${pager.base}?page=${page}`) as Route;
}

function PagerLink({
  children,
  disabled,
  href,
  label,
}: {
  children: React.ReactNode;
  disabled: boolean;
  href: Route;
  label: string;
}) {
  const className =
    'text-gray inline-flex size-6 items-center justify-center rounded-full transition-colors hover:bg-black/5 hover:text-black dark:hover:bg-white/10 dark:hover:text-white';
  if (disabled) {
    return (
      <span aria-disabled className={cn(className, 'cursor-default opacity-40 hover:bg-transparent')}>
        {children}
      </span>
    );
  }
  return (
    <PrefetchLink aria-label={label} className={className} href={href} title={label}>
      {children}
    </PrefetchLink>
  );
}

function RowCheckbox({
  checked,
  className,
  label,
  onChange,
}: {
  checked: boolean;
  className?: string;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={cn(
        'relative z-20 flex size-7 items-center justify-center rounded-full border transition-colors',
        checked
          ? 'border-accent bg-accent text-white'
          : 'border-gray/50 bg-card hover:border-gray dark:bg-card-dark text-transparent',
        className,
      )}
      onClick={onChange}
      role="checkbox"
      type="button"
    >
      <Check className="size-3" strokeWidth={3} />
    </button>
  );
}

function SelectAvatar({
  checked,
  label,
  name,
  onChange,
}: {
  checked: boolean;
  label: string;
  name: string;
  onChange: () => void;
}) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className="group/select focus-visible:ring-accent/40 relative z-20 flex size-9 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
      onClick={onChange}
      role="checkbox"
      type="button"
    >
      <span className={cn('absolute inset-0', checked ? 'invisible' : 'group-hover/select:invisible')}>
        <UserAvatar name={name} />
      </span>
      <span
        className={cn(
          'flex size-7 items-center justify-center rounded-full border',
          checked
            ? 'border-accent bg-accent text-white'
            : 'border-gray/50 bg-card dark:bg-card-dark invisible text-transparent group-hover/select:visible',
        )}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}

function RowButton({
  active,
  children,
  className,
  disabled,
  label,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'text-gray inline-flex size-6 items-center justify-center rounded-full transition-colors hover:bg-black/5 hover:text-black disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-white/10 dark:hover:text-white',
        active && 'text-accent hover:text-accent',
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}
