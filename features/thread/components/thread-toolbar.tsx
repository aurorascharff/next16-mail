'use client';

import { Archive, ArchiveRestore, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { actionToast } from '@/components/ui/action-toast';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';
import { moveThread, toggleStar } from '../thread-actions';
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
      <Star className={cn('size-4', optimisticStarred && 'fill-current')} />
    </IconButton>
  );
}

export function ArchiveButton({
  backHref,
  threadId,
  threadMailbox,
}: {
  backHref: Route;
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
          router.push(backHref);
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

export function BackToList({ href }: { href: Route }) {
  return (
    <Boundary label="BackToList" asChild>
      <Link
        aria-label="Back to list"
        className="text-gray hover:bg-card dark:hover:bg-card-dark inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:text-black dark:hover:text-white"
        href={href}
        prefetch={true}
      >
        <ArrowLeft className="size-5" />
      </Link>
    </Boundary>
  );
}
