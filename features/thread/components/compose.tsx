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
      <Skeleton className="skeleton-subtle mt-6 h-10 rounded-md" />
      <Skeleton className="skeleton-subtle mt-6 h-10 rounded-md" />
      <Skeleton className="skeleton-subtle mt-6 h-56 rounded-md" />
    </div>
  );
}
