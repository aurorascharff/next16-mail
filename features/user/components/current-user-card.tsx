import { Skeleton } from '@/components/ui/skeleton';
import { getAccounts, getCurrentUser } from '../user-queries';
import { UserAvatar } from './user-avatar';
import { UserSwitcher } from './user-switcher';

export async function CurrentUserCard() {
  const [user, accounts] = await Promise.all([getCurrentUser(), getAccounts()]);

  return (
    <div
      className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark flex h-14 items-center gap-3 rounded-xl border px-2.5"
      data-testid="current-user"
    >
      <UserAvatar name={user.name} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{user.name}</p>
        <p className="text-muted truncate text-xs">{user.email}</p>
      </div>
      <UserSwitcher accounts={accounts} currentUserId={user.id} />
    </div>
  );
}

export function CurrentUserCardSkeleton() {
  return (
    <div className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark flex h-14 items-center gap-3 rounded-xl border px-2.5">
      <Skeleton className="skeleton-subtle size-9 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="flex h-5 items-center">
          <Skeleton className="h-3.5 w-24" />
        </span>
        <span className="flex h-4 items-center">
          <Skeleton className="h-3 w-32" />
        </span>
      </div>
      <Skeleton className="skeleton-subtle size-8 rounded-full" />
    </div>
  );
}
