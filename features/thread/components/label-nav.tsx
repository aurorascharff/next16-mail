import Link from 'next/link';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { getLabels } from '../thread-queries';
import type { Route } from 'next';

export async function LabelNav({ intentPrefetch = true }: { intentPrefetch?: boolean }) {
  const labels = await getLabels();

  return (
    <nav aria-label="Labels" className="flex flex-col gap-0.5">
      <p className="text-gray flex h-9 items-center px-3 text-sm font-semibold tracking-tight">Labels</p>
      {labels.map(label => {
        const href = `/search?q=${encodeURIComponent(label.name)}` as Route;
        const children = (
          <>
            <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: label.color }} />
            {label.name}
          </>
        );
        const props = {
          children,
          className:
            'hover:bg-card dark:hover:bg-card-dark flex h-9 items-center gap-3 rounded-lg px-3 text-sm tracking-tight transition-colors',
          href,
        };

        return intentPrefetch ? (
          <HoverPrefetchLink {...props} key={label.id} />
        ) : (
          <Link {...props} key={label.id} prefetch="auto" />
        );
      })}
    </nav>
  );
}

export function LabelNavSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-0.5">
      <p className="text-gray flex h-9 items-center px-3 text-sm font-semibold tracking-tight">Labels</p>
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="flex h-9 items-center gap-3 px-3" key={index}>
          <Skeleton className="size-2.5 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
