import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { getLabels } from '../thread-queries';
import type { Route } from 'next';

export async function LabelNav() {
  const labels = await getLabels();

  return (
    <nav aria-label="Labels" className="flex flex-col gap-0.5">
      <p className="text-gray flex h-9 items-center px-3 text-sm font-semibold tracking-tight">Labels</p>
      {labels.map(label => (
        <PrefetchLink
          className="hover:bg-card dark:hover:bg-card-dark flex h-9 items-center gap-3 rounded-lg px-3 text-sm tracking-tight transition-colors"
          href={`/search?q=${encodeURIComponent(label.name)}` as Route}
          key={label.id}
        >
          <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: label.color }} />
          {label.name}
        </PrefetchLink>
      ))}
    </nav>
  );
}

export function LabelNavSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-0.5">
      <p className="text-gray flex h-9 items-center px-3 text-sm font-semibold tracking-tight">Labels</p>
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="flex h-9 items-center gap-3 px-3" key={index}>
          <Skeleton className="skeleton-subtle size-2.5 rounded-full" />
          <Skeleton className="skeleton-subtle h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
