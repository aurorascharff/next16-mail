import { Skeleton } from '@/components/ui/skeleton';
import { getContacts } from '../thread-queries';
import { ComposeForm } from './compose-form';

export async function Compose() {
  const contacts = await getContacts();
  return <ComposeForm contacts={contacts} />;
}

export function ComposeSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-4">
      {[0, 1].map(index => (
        <div className="grid gap-1.5" key={index}>
          <span className="flex h-4 items-center">
            <Skeleton className="skeleton-subtle h-3 w-12" />
          </span>
          <Skeleton className="skeleton-subtle h-10 rounded-md" />
        </div>
      ))}
      <div className="grid gap-1.5">
        <span className="flex h-4 items-center">
          <Skeleton className="skeleton-subtle h-3 w-16" />
        </span>
        <Skeleton className="skeleton-subtle h-56 rounded-md" />
      </div>
      <div className="flex h-9 justify-end">
        <Skeleton className="skeleton-subtle h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}
