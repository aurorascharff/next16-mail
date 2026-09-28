'use client';

import { Archive, ArchiveRestore, Check, Mail, MailOpen, Star, X } from 'lucide-react';
import { createContext, use, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { actionToast } from '@/components/ui/action-toast';
import { cn } from '@/lib/utils';
import { markThreadsRead, moveThreads, starThreads } from '../thread-actions';
import { RowButton } from './row-button';
import { ListTitle, ThreadListHeader } from './thread-list-header';
import type { Mailbox } from '../thread-mailboxes';

export type SelectableThread = { id: string; read: boolean; starred: boolean };
type Selection = {
  selected: Map<string, SelectableThread>;
  setSelected: (next: Map<string, SelectableThread>) => void;
};

const SelectionContext = createContext<Selection>({ selected: new Map(), setSelected: () => {} });

// Key the provider by mailbox and page so a new page starts with nothing selected.
export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Map<string, SelectableThread>>(new Map());
  return <SelectionContext value={{ selected, setSelected }}>{children}</SelectionContext>;
}

export function useSelection() {
  return use(SelectionContext);
}

export function useRowSelection(thread: SelectableThread) {
  const { selected, setSelected } = useSelection();
  return {
    selected: selected.has(thread.id),
    toggle() {
      const next = new Map(selected);
      if (next.has(thread.id)) next.delete(thread.id);
      else next.set(thread.id, thread);
      setSelected(next);
    },
  };
}

export function ThreadListToolbar({
  mailbox,
  pager,
  selectAll,
  title,
}: {
  mailbox?: Mailbox;
  pager: React.ReactNode;
  selectAll: React.ReactNode;
  title: string;
}) {
  const { selected, setSelected } = useSelection();
  const count = selected.size;
  return (
    <ThreadListHeader
      leading={
        <>
          {selectAll}
          {count > 0 ? <BulkActions mailbox={mailbox} /> : <ListTitle>{title}</ListTitle>}
        </>
      }
      trailing={
        count > 0 ? (
          <RowButton label="Clear selection" onClick={() => setSelected(new Map())}>
            <X className="size-4" />
          </RowButton>
        ) : (
          pager
        )
      }
    />
  );
}

const selectAllClass =
  'border-gray/50 bg-card dark:bg-card-dark ml-2 flex size-5 shrink-0 items-center justify-center rounded-full border text-transparent transition-colors';

// Without ids the control is disabled but still drawn, so the header keeps its shape while rows load.
export function SelectAll({ threads }: { threads?: SelectableThread[] }) {
  const { selected, setSelected } = useSelection();
  const all = threads !== undefined && threads.length > 0 && threads.every(thread => selected.has(thread.id));
  return (
    <button
      aria-checked={all}
      aria-label={all ? 'Clear selection' : 'Select all on this page'}
      className={cn(selectAllClass, all ? 'border-accent bg-accent text-white' : 'enabled:hover:border-gray')}
      disabled={!threads || threads.length === 0}
      onClick={() => setSelected(all ? new Map() : new Map(threads?.map(thread => [thread.id, thread])))}
      role="checkbox"
      type="button"
    >
      <Check className="size-3" strokeWidth={3} />
    </button>
  );
}

type ActionResult = { ok: true } | { ok: false; error: string };

function BulkActions({ mailbox }: { mailbox?: Mailbox }) {
  const { selected, setSelected } = useSelection();
  const [isPending, startTransition] = useTransition();
  const chosen = [...selected.values()];
  const ids = chosen.map(thread => thread.id);
  const canMove = mailbox === 'inbox' || mailbox === 'archive';
  const target = mailbox === 'archive' ? 'inbox' : 'archive';
  const star = chosen.some(thread => !thread.starred);
  const read = chosen.some(thread => !thread.read);

  function run(action: () => Promise<ActionResult>, onDone?: () => void) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setSelected(new Map());
      onDone?.();
    });
  }

  return (
    <>
      <span className="text-sm font-semibold tabular-nums">{ids.length} selected</span>
      {canMove ? (
        <RowButton
          disabled={isPending}
          label={target === 'archive' ? 'Archive' : 'Move to inbox'}
          onClick={() =>
            run(
              () => moveThreads(ids, target),
              () =>
                actionToast(
                  `${ids.length} ${ids.length === 1 ? 'conversation' : 'conversations'} ${target === 'archive' ? 'archived' : 'moved to inbox'}`,
                  { label: 'Undo', run: () => moveThreads(ids, target === 'archive' ? 'inbox' : 'archive') },
                ),
            )
          }
        >
          {target === 'archive' ? <Archive className="size-4" /> : <ArchiveRestore className="size-4" />}
        </RowButton>
      ) : null}
      <RowButton
        disabled={isPending}
        label={star ? 'Star' : 'Remove star'}
        onClick={() => run(() => starThreads(ids, star))}
      >
        <Star className={cn('size-4', !star && 'fill-current')} strokeWidth={1.5} />
      </RowButton>
      <RowButton
        disabled={isPending}
        label={read ? 'Mark as read' : 'Mark as unread'}
        onClick={() => run(() => markThreadsRead(ids, read))}
      >
        {read ? <MailOpen className="size-4" /> : <Mail className="size-4" />}
      </RowButton>
    </>
  );
}
