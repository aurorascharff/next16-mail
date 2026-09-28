'use client';

import { ArrowLeftRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';
import { switchUser } from '../user-actions';
import type { User } from '../types/user';

export function UserSwitcher({ accounts, currentUserId }: { accounts: User[]; currentUserId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const index = accounts.findIndex(account => account.id === currentUserId);
  const next = accounts[(index + 1) % accounts.length];

  if (!next || next.id === currentUserId) return null;

  return (
    <IconButton
      data-user-switching={isPending ? '' : undefined}
      disabled={isPending}
      label={`Switch to ${next.name}`}
      onClick={() => {
        startTransition(async () => {
          await switchUser(next.id);
          router.push('/inbox');
        });
      }}
    >
      <ArrowLeftRight aria-hidden className={cn('size-4 transition-transform', isPending && 'rotate-180')} />
    </IconButton>
  );
}
