import { PenLine } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button-classes';
import { PrefetchLink } from '@/components/ui/prefetch-link';

export function ComposeButton() {
  return (
    <PrefetchLink
      className={buttonClasses({ className: 'w-full', variant: 'accent' })}
      data-testid="compose"
      href="/compose"
    >
      <PenLine className="size-4" /> Compose
    </PrefetchLink>
  );
}
