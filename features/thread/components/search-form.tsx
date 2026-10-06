'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useId, useLayoutEffect, useRef, useTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import type { Route } from 'next';

function searchHref(query: string) {
  return (query ? `/search?q=${encodeURIComponent(query)}` : '/search') as Route;
}

export function SearchForm() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [isPending, startTransition] = useTransition();
  const query = searchParams.get('q') ?? '';

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.value = query;
    if (pathname === '/search') {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, [pathname, query]);

  return (
    <Boundary label="SearchForm">
      <form
        className="relative"
        data-pending={isPending ? '' : undefined}
        style={{ viewTransitionName: 'search-form' }}
        onSubmit={event => event.preventDefault()}
        role="search"
      >
        <label className="sr-only" htmlFor={inputId}>
          Search mail
        </label>
        <Search
          aria-hidden
          className="text-gray pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 data-pending:animate-pulse"
          data-pending={isPending ? '' : undefined}
        />
        <input
          autoComplete="off"
          className="bg-card dark:bg-card-dark placeholder-gray focus:ring-accent/30 h-10 w-full rounded-lg pr-3 pl-9 text-sm outline-none focus:ring-2"
          id={inputId}
          name="q"
          onChange={event => {
            const href = searchHref(event.currentTarget.value.trim());
            startTransition(() => router.replace(href, { scroll: false }));
          }}
          placeholder="Search mail"
          ref={inputRef}
          suppressHydrationWarning
          type="search"
        />
      </form>
    </Boundary>
  );
}
