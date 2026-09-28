'use client';

import { Archive, ArchiveRestore, ArrowLeft, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition, useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { actionToast } from '@/components/ui/action-toast';
import { IconButton } from '@/components/ui/icon-button';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { cn } from '@/lib/utils';
import { moveThread, toggleStar } from '../thread-actions';
import type { Mailbox } from '../thread-mailboxes';
import type { Route } from 'next';

export function StarButton({ starred, threadId }: { starred: boolean; threadId: string }) {
  const [optimisticStarred, setOptimisticStarred] = useOptimistic(starred);

  return (
    <IconButton
      aria-pressed={optimisticStarred}
      className={cn(optimisticStarred && 'text-accent hover:text-accent')}
      label={optimisticStarred ? 'Remove star' : 'Star'}
      onClick={() =>
        startTransition(async () => {
          setOptimisticStarred(!optimisticStarred);
          const result = await toggleStar(threadId, !optimisticStarred);
          if (!result.ok) toast.error(result.error);
        })
      }
    >
      <Star className={cn('size-4', optimisticStarred && 'fill-current')} strokeWidth={1.5} />
    </IconButton>
  );
}

export function ArchiveButton({
  mailbox,
  threadId,
  threadMailbox,
}: {
  mailbox: Mailbox;
  threadId: string;
  threadMailbox: string;
}) {
  const router = useRouter();
  const [isPending, startArchive] = useTransition();
  const archived = threadMailbox === 'archive';

  return (
    <IconButton
      aria-busy={isPending || undefined}
      disabled={isPending}
      label={archived ? 'Move to inbox' : 'Archive'}
      onClick={() =>
        startArchive(async () => {
          const result = await moveThread(threadId, archived ? 'inbox' : 'archive');
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          router.push(`/${mailbox}` as Route);
          actionToast(archived ? 'Conversation moved to inbox' : 'Conversation archived', {
            label: 'Undo',
            run: () => moveThread(threadId, archived ? 'archive' : 'inbox'),
          });
        })
      }
    >
      {archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
    </IconButton>
  );
}

export function BackToList({ mailbox }: { mailbox: Mailbox }) {
  return (
    <Boundary label="BackToList" asChild>
      <PrefetchLink
        aria-label="Back to list"
        className="text-muted hover:bg-card dark:hover:bg-card-dark mt-0.5 inline-flex size-7 items-center justify-center rounded-full transition-colors hover:text-black lg:hidden dark:hover:text-white"
        href={`/${mailbox}`}
      >
        <ArrowLeft className="size-4" />
      </PrefetchLink>
    </Boundary>
  );
}
