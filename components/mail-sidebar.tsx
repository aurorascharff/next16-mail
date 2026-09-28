import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { ComposeButton } from '@/features/thread/components/compose-button';
import { LabelNav, LabelNavSkeleton } from '@/features/thread/components/label-nav';
import { MailboxNav, MailboxNavSkeleton } from '@/features/thread/components/mailbox-nav';
import { CurrentUserCard, CurrentUserCardSkeleton } from '@/features/user/components/current-user-card';

export function MailSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-6 px-3 pt-1 pb-3 md:flex">
      <div className="px-1">
        <ComposeButton />
      </div>
      <Suspense fallback={<MailboxNavSkeleton />}>
        <MailboxNav />
      </Suspense>
      <Suspense fallback={<LabelNavSkeleton />}>
        <LabelNav />
      </Suspense>
      <div className="mt-auto flex flex-col gap-2">
        <div className="px-2">
          <ThemeToggle variant="inline" />
        </div>
        <Suspense fallback={<CurrentUserCardSkeleton />}>
          <CurrentUserCard />
        </Suspense>
      </div>
    </aside>
  );
}
