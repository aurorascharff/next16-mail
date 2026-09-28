'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { usePrefetchDefault } from '@/features/demo/hooks/use-prefetch-default';
import type { Route } from 'next';

type Props<T extends string = string> = Omit<React.ComponentProps<typeof Link>, 'href'> & { href: Route<T> };

function isActivePath(pathname: string, target: string) {
  if (target === '/') return pathname === target;
  return pathname === target || pathname.startsWith(`${target}/`);
}

export function NavLink<T extends string>(props: Props<T>) {
  return (
    <Boundary label="NavLink">
      <Suspense fallback={<NavLinkShell {...props} isActive={false} />}>
        <NavLinkInner {...props} />
      </Suspense>
    </Boundary>
  );
}

function NavLinkInner<T extends string>(props: Props<T>) {
  const pathname = usePathname();
  return <NavLinkShell {...props} isActive={isActivePath(pathname, props.href)} />;
}

function NavLinkShell<T extends string>({ href, isActive, prefetch, ...rest }: Props<T> & { isActive: boolean }) {
  const defaultPrefetch = usePrefetchDefault();

  return (
    <Link
      href={href as Route}
      aria-current={isActive ? 'page' : undefined}
      data-navlink-href={href}
      suppressHydrationWarning
      prefetch={prefetch ?? defaultPrefetch}
      {...rest}
    />
  );
}
