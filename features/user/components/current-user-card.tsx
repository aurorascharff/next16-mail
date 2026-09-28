import { Skeleton } from '@/components/ui/skeleton';
import { getAccounts, getCurrentUser } from '../user-queries';
import { UserAvatar } from './user-avatar';
import { UserSwitcher } from './user-switcher';

export async function CurrentUserCard() {
  const [user, accounts] = await Promise.all([getCurrentUser(), getAccounts()]);

  return (
    <div className="flex h-12 items-center gap-2.5 rounded-lg px-2" data-testid="current-user">
      <UserAvatar name={user.name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold tracking-tight">{user.name}</p>
        <p className="text-gray truncate text-xs">{user.email}</p>
      </div>
      <UserSwitcher accounts={accounts} currentUserId={user.id} />
    </div>
  );
}

export function CurrentUserCardSkeleton() {
  return (
    <div className="flex h-12 items-center gap-2.5 rounded-lg px-2">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="flex h-5 items-center">
          <Skeleton className="h-3.5 w-24" />
        </span>
        <span className="flex h-4 items-center">
          <Skeleton className="h-3 w-32" />
        </span>
      </div>
      <Skeleton className="size-8 rounded-full" />
    </div>
  );
}
