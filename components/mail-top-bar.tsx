import { MobileSidebarTrigger } from '@/components/mobile-sidebar';
import { BrandMark } from '@/components/ui/brand-mark';
import { GitHubIcon } from '@/components/ui/github-icon';
import { IconButton } from '@/components/ui/icon-button';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { SearchForm } from '@/features/thread/components/search-form';

export function MailTopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-3 sm:px-4 md:gap-3">
      <MobileSidebarTrigger className="-ml-1 size-10" />
      <div className="hidden w-56 items-center gap-1 pl-2 md:flex">
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
      <div className="min-w-0 flex-1 md:max-w-2xl">
        <SearchForm />
      </div>
    </header>
  );
}
