'use client';

import * as Ariakit from '@ariakit/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { cn } from '@/lib/utils';
import { switchUser } from '../user-actions';
import { UserAvatar } from './user-avatar';
import type { User } from '../types/user';

export function UserSwitcher({ accounts, currentUserId }: { accounts: User[]; currentUserId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticId, setOptimisticId] = useOptimistic(currentUserId);
  const selected = accounts.find(account => account.id === optimisticId) ?? accounts[0];
  const popover = Ariakit.usePopoverStore({ placement: 'bottom-start' });

  function select(id: string) {
    popover.hide();
    if (id === optimisticId) return;
    startTransition(async () => {
      setOptimisticId(id);
      await switchUser(id);
      router.push('/inbox');
    });
  }

  return (
    <Boundary label="UserSwitcher">
      <div data-pending={isPending ? '' : undefined} data-testid="current-user">
        <Ariakit.PopoverDisclosure
          className="hover:bg-card dark:hover:bg-card-dark flex h-12 w-full items-center gap-2.5 rounded-lg px-2 text-left transition-colors data-pending:opacity-60"
          store={popover}
        >
          <UserAvatar name={selected.name} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm leading-tight font-semibold tracking-tight">{selected.name}</span>
            <span className="text-gray block truncate text-xs leading-tight">{selected.email}</span>
          </span>
          <ChevronsUpDown className="text-gray size-3.5 shrink-0" />
        </Ariakit.PopoverDisclosure>
        <Ariakit.Popover
          className="border-divider dark:border-divider-dark z-50 overflow-hidden rounded-xl border bg-white shadow-xl dark:bg-black"
          gutter={6}
          overflowPadding={16}
          portal
          sameWidth
          store={popover}
          style={{ viewTransitionName: 'account-menu' }}
        >
          <p className="text-gray border-divider/70 dark:border-divider-dark/70 border-b px-4 py-2 text-xs font-medium">
            Switch account
          </p>
          <div className="py-1">
            {accounts.map(account => (
              <button
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5',
                  account.id === optimisticId && 'bg-black/[0.03] dark:bg-white/[0.03]',
                )}
                key={account.id}
                onClick={() => select(account.id)}
                type="button"
              >
                <UserAvatar name={account.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{account.title}</span>
                  <span className="text-gray block truncate text-xs">{account.email}</span>
                </span>
                {account.id === optimisticId ? <Check className="text-accent size-4 shrink-0" /> : null}
              </button>
            ))}
          </div>
        </Ariakit.Popover>
      </div>
    </Boundary>
  );
}
