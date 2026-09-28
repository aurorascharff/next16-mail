'use client';

import Link from 'next/link';
import { useState, type ComponentProps } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { usePrefetchDefault } from '@/features/demo/hooks/use-prefetch-default';
import type { Route } from 'next';

type Props<T extends string = string> = Omit<ComponentProps<typeof Link>, 'href' | 'prefetch'> & {
  href: Route<T> | URL;
};

/**
 * A `<Link>` that only requests its per-link prefetch once the user shows intent (pointer, focus, or touch).
 * A list of many rows would otherwise wake the server once per visible row.
 */
export function HoverPrefetchLink<T extends string>({ href, onFocus, onMouseEnter, onTouchStart, ...props }: Props<T>) {
  const [intent, setIntent] = useState(false);
  const enabled = usePrefetchDefault() === true;

  return (
    <Boundary label="HoverPrefetchLink" asChild>
      <Link
        {...props}
        href={href as Route}
        onFocus={event => {
          setIntent(true);
          onFocus?.(event);
        }}
        onMouseEnter={event => {
          setIntent(true);
          onMouseEnter?.(event);
        }}
        onTouchStart={event => {
          setIntent(true);
          onTouchStart?.(event);
        }}
        prefetch={enabled && intent ? true : null}
      />
    </Boundary>
  );
}
