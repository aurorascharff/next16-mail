import { Archive, Inbox, PenLine, Search, Send, Star } from 'lucide-react';
import { NavLink } from '@/components/ui/nav-link';

const items = [
  { href: '/inbox', icon: Inbox, label: 'Inbox' },
  { href: '/starred', icon: Star, label: 'Starred' },
  { href: '/sent', icon: Send, label: 'Sent' },
  { href: '/archive', icon: Archive, label: 'Archive' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/compose', icon: PenLine, label: 'Compose' },
] as const;

export function MobileTabBar() {
  return (
    <nav
      aria-label="Mailboxes"
      className="border-divider dark:border-divider-dark bg-surface/90 dark:bg-surface-dark/90 flex shrink-0 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
    >
      {items.map(({ href, icon: Icon, label }) => (
        <NavLink
          className="text-muted aria-[current=page]:text-accent flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[0.625rem] font-medium transition-colors aria-[current=page]:font-semibold"
          href={href}
          key={href}
          prefetch={true}
        >
          <Icon aria-hidden className="size-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
