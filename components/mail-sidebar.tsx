import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { BrandMark } from '@/components/ui/brand-mark';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { ComposeButton } from '@/features/thread/components/compose-button';
import { LabelNav, LabelNavSkeleton } from '@/features/thread/components/label-nav';
import { MailboxNav, MailboxNavSkeleton } from '@/features/thread/components/mailbox-nav';
import { CurrentUserCard, CurrentUserCardSkeleton } from '@/features/user/components/current-user-card';
import { cn } from '@/lib/utils';

export function MailSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 md:flex">
      <MailSidebarContent />
    </aside>
  );
}

// Rendered in the desktop sidebar and inside the mobile drawer, which adds the brand row.
export function MailSidebarContent({ drawer = false }: { drawer?: boolean }) {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col gap-6 px-3 pb-3', drawer ? 'pt-0' : 'pt-1')}>
      {drawer ? (
        <PrefetchLink
          aria-label="Stamp inbox"
          className="flex h-10 items-center gap-2.5 px-2 text-xl font-bold tracking-tight"
          href="/inbox"
        >
          <BrandMark className="text-accent size-7" />
          Stamp
        </PrefetchLink>
      ) : (
        <div className="px-1">
          <ComposeButton />
        </div>
      )}
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
    </div>
  );
}
