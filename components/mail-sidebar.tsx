import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { BrandMark } from '@/components/ui/brand-mark';
import ErrorBoundary from '@/components/ui/error-boundary';
import { GitHubIcon } from '@/components/ui/github-icon';
import { IconButton } from '@/components/ui/icon-button';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { ComposeButton } from '@/features/thread/components/compose-button';
import { MailboxNav, MailboxNavSkeleton } from '@/features/thread/components/mailbox-nav';
import { CurrentUserCard, CurrentUserCardSkeleton } from '@/features/user/components/current-user-card';

export function MailSidebar() {
  return (
    <aside
      className="border-divider/70 dark:border-divider-dark/70 hidden w-64 shrink-0 flex-col gap-5 border-r px-3 pt-5 pb-4 md:flex"
      style={{ viewTransitionName: 'mail-sidebar' }}
    >
      <div className="flex items-center justify-between pl-2">
        <PrefetchLink
          aria-label="Stamp inbox"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight"
          href="/inbox"
        >
          <BrandMark className="text-accent size-7" />
          Stamp
        </PrefetchLink>
        <IconButton external href="https://github.com/aurorascharff/next16-mail" label="View source on GitHub">
          <GitHubIcon className="size-4" />
        </IconButton>
      </div>
      <Suspense fallback={<CurrentUserCardSkeleton />}>
        <CurrentUserCard />
      </Suspense>
      <ErrorBoundary className="min-h-0 py-6" title="Mailboxes unavailable">
        <Suspense fallback={<MailboxNavSkeleton />}>
          <MailboxNav />
        </Suspense>
      </ErrorBoundary>
      <ComposeButton />
      <div className="mt-auto px-2">
        <ThemeToggle variant="inline" />
      </div>
    </aside>
  );
}
