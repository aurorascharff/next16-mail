'use client';

import Link from 'next/link';
import { useRef, useState, type ComponentProps } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { usePrefetchDefault } from '@/features/demo/hooks/use-prefetch-default';
import type { Route } from 'next';

type Props<T extends string = string> = Omit<ComponentProps<typeof Link>, 'href' | 'prefetch'> & {
  href: Route<T> | URL;
};

const INTENT_DELAY = 150;

export function HoverPrefetchLink<T extends string>({
  href,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  ...props
}: Props<T>) {
  const [intent, setIntent] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enabled = usePrefetchDefault() === true;

  function armIntent() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIntent(true), INTENT_DELAY);
  }

  function cancelIntent() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }

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
          armIntent();
          onMouseEnter?.(event);
        }}
        onMouseLeave={event => {
          cancelIntent();
          onMouseLeave?.(event);
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
