import type { Route } from 'next';

export type ListLocation = { base: string; page?: number; q?: string };

export function listHref({ base, page = 1, q }: ListLocation) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return (query ? `${base}?${query}` : base) as Route;
}
