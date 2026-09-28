import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { cn } from '@/lib/utils';
import { listHref, type ListLocation } from '../thread-list-url';
import type { Route } from 'next';

export function ThreadListHeader({ leading, trailing }: { leading: React.ReactNode; trailing?: React.ReactNode }) {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between gap-3 border-b bg-white/90 px-4 backdrop-blur-md sm:px-5 dark:bg-black/90">
      <div className="flex min-w-0 items-center gap-3">{leading}</div>
      <div className="flex shrink-0 items-center gap-1">{trailing}</div>
    </div>
  );
}

export function ListTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="truncate text-sm font-semibold tracking-tight">{children}</h2>;
}

const selectAllClass =
  'ml-2 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors border-gray/50 bg-card dark:bg-card-dark text-transparent';

// Without an href the control is disabled but still drawn, so the header keeps its shape while rows load.
export function SelectAll({ checked = false, href }: { checked?: boolean; href?: Route }) {
  if (!href) {
    return (
      <button
        aria-checked={false}
        aria-label="Select all on this page"
        className={selectAllClass}
        disabled
        role="checkbox"
        type="button"
      />
    );
  }
  return (
    <Link
      aria-checked={checked}
      aria-label={checked ? 'Clear selection' : 'Select all on this page'}
      className={cn(selectAllClass, checked ? 'border-accent bg-accent text-white' : 'hover:border-gray')}
      href={href}
      prefetch={false}
      replace
      role="checkbox"
      scroll={false}
    >
      <Check className="size-3" strokeWidth={3} />
    </Link>
  );
}

const iconLinkClass =
  'text-gray inline-flex size-6 items-center justify-center rounded-full transition-colors hover:bg-black/5 hover:text-black dark:hover:bg-white/10 dark:hover:text-white';

export function ClearSelection({ href }: { href: Route }) {
  return (
    <Link
      aria-label="Clear selection"
      className={iconLinkClass}
      href={href}
      prefetch={false}
      replace
      scroll={false}
      title="Clear selection"
    >
      <X className="size-4" />
    </Link>
  );
}

export function Pager({
  count,
  list,
  pageSize,
  total,
}: {
  count: number;
  list: ListLocation;
  pageSize: number;
  total: number;
}) {
  const page = list.page ?? 1;
  const start = (page - 1) * pageSize;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return (
    <>
      <span className="text-gray mr-1 text-xs tabular-nums">
        {count === 0 ? 0 : `${start + 1}–${start + count}`} of {total}
      </span>
      <PagerLink disabled={page <= 1} href={listHref({ ...list, page: page - 1, selected: [] })} label="Newer">
        <ChevronLeft className="size-4" />
      </PagerLink>
      <PagerLink disabled={page >= pageCount} href={listHref({ ...list, page: page + 1, selected: [] })} label="Older">
        <ChevronRight className="size-4" />
      </PagerLink>
    </>
  );
}

function PagerLink({
  children,
  disabled,
  href,
  label,
}: {
  children: React.ReactNode;
  disabled: boolean;
  href: Route;
  label: string;
}) {
  if (disabled) {
    return (
      <span aria-disabled className={cn(iconLinkClass, 'cursor-default opacity-40 hover:bg-transparent')}>
        {children}
      </span>
    );
  }
  return (
    <PrefetchLink aria-label={label} className={iconLinkClass} href={href} title={label}>
      {children}
    </PrefetchLink>
  );
}
