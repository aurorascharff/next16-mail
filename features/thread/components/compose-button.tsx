import { PenLine } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button-classes';
import { getContacts } from '../thread-queries';
import { ComposeDialog } from './compose-dialog';

/** Opens the compose dialog with the contacts this account can write to. */
export async function ComposeButton() {
  const contacts = await getContacts();
  return <ComposeDialog contacts={contacts} />;
}

export function ComposeButtonSkeleton() {
  return (
    <span aria-hidden className={buttonClasses({ className: 'w-full opacity-60', size: 'lg', variant: 'accent' })}>
      <PenLine className="size-4" /> Compose
    </span>
  );
}
