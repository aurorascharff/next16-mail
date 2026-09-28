import { Skeleton } from '@/components/ui/skeleton';
import { getAccounts, getCurrentUser } from '../user-queries';
import { UserSwitcher } from './user-switcher';

export async function CurrentUserCard() {
  const [user, accounts] = await Promise.all([getCurrentUser(), getAccounts()]);
  return <UserSwitcher accounts={accounts} currentUserId={user.id} />;
}

export function CurrentUserCardSkeleton() {
  return (
    <div aria-hidden className="flex h-12 items-center gap-2.5 px-2">
      <Skeleton className="skeleton-subtle size-8 shrink-0 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="skeleton-subtle h-3 w-32" />
      </div>
    </div>
  );
}
