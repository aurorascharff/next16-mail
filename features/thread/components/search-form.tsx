'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useId, useTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import type { Route } from 'next';

function searchHref(query: string) {
  return (query ? `/search?q=${encodeURIComponent(query)}` : '/search') as Route;
}

/** Searches across mailboxes. Defaults come from the URL, so the form lives in the shell and remounts per query. */
export function SearchForm() {
  return (
    <Boundary label="SearchForm">
      <Suspense fallback={<SearchFields initialQuery="" />}>
        <SearchFormInner />
      </Suspense>
    </Boundary>
  );
}

function SearchFormInner() {
  const params = useSearchParams();
  const query = params.get('q') ?? '';
  return <SearchFields initialQuery={query} key={query} />;
}

function SearchFields({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const inputId = useId();
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="relative"
      data-pending={isPending ? '' : undefined}
      onSubmit={event => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get('q');
        const next = typeof value === 'string' ? value.trim() : '';
        startTransition(() => router.push(searchHref(next)));
      }}
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
        className="bg-card dark:bg-card-dark placeholder-gray focus:ring-accent/30 h-10 w-full rounded-full pr-4 pl-10 text-sm outline-none focus:ring-2"
        defaultValue={initialQuery}
        id={inputId}
        name="q"
        onChange={event => router.prefetch(searchHref(event.currentTarget.value.trim()))}
        placeholder="Search mail"
        type="search"
      />
    </form>
  );
}
