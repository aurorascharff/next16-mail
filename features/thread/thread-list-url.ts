import type { Route } from 'next';

export type ListLocation = { base: string; page?: number; q?: string; selected?: string[] };

export function parseSelected(value: string | string[] | undefined): string[] {
  return typeof value === 'string' ? [...new Set(value.split(',').filter(Boolean))] : [];
}

export function listHref({ base, page = 1, q, selected = [] }: ListLocation) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (page > 1) params.set('page', String(page));
  if (selected.length > 0) params.set('selected', selected.join(','));
  const query = params.toString();
  return (query ? `${base}?${query}` : base) as Route;
}

export function toggled(selected: string[], id: string) {
  return selected.includes(id) ? selected.filter(value => value !== id) : [...selected, id];
}
