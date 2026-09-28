'use client';

import { Archive, ArchiveRestore, MailOpen, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { actionToast } from '@/components/ui/action-toast';
import { markThreadsRead, moveThreads, starThreads } from '../thread-actions';
import { RowButton } from './row-button';
import type { Mailbox } from '../thread-mailboxes';
import type { Route } from 'next';

type ActionResult = { ok: true } | { ok: false; error: string };

export function BulkActions({ clearHref, ids, mailbox }: { clearHref: Route; ids: string[]; mailbox?: Mailbox }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const canMove = mailbox === 'inbox' || mailbox === 'archive';
  const target = mailbox === 'archive' ? 'inbox' : 'archive';

  function run(action: () => Promise<ActionResult>, onDone?: () => void) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.replace(clearHref);
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
      <RowButton disabled={isPending} label="Star" onClick={() => run(() => starThreads(ids, true))}>
        <Star className="size-4" strokeWidth={1.5} />
      </RowButton>
      <RowButton disabled={isPending} label="Mark as read" onClick={() => run(() => markThreadsRead(ids, true))}>
        <MailOpen className="size-4" />
      </RowButton>
    </>
  );
}
