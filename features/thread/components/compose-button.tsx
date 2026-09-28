'use client';

import { PenLine } from 'lucide-react';
import { Boundary } from '@/components/internal/boundary';
import { buttonClasses } from '@/components/ui/button-classes';
import { cn } from '@/lib/utils';
import { useCompose } from '../providers/compose-provider';

export function ComposeButton({ className, variant = 'sidebar' }: { className?: string; variant?: 'sidebar' | 'fab' }) {
  const { open, state } = useCompose();

  // Gmail's floating compose on small screens; the panel it opens covers the viewport there.
  if (variant === 'fab') {
    if (state !== 'closed') return null;
    return (
      <Boundary label="ComposeButton" asChild>
        <button
          className={cn(
            'bg-accent shadow-accent/30 fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex h-14 items-center gap-2 rounded-2xl pr-5 pl-4 text-sm font-semibold text-white shadow-xl transition-transform active:scale-95 md:hidden',
            className,
          )}
          data-testid="compose-fab"
          onClick={open}
          style={{ viewTransitionName: 'compose-fab' }}
          type="button"
        >
          <PenLine aria-hidden className="size-5" />
          Compose
        </button>
      </Boundary>
    );
  }

  return (
    <Boundary label="ComposeButton" asChild>
      <button
        className={cn(buttonClasses({ className: 'w-full', variant: 'accent' }), className)}
        data-testid="compose"
        onClick={open}
        type="button"
      >
        <PenLine className="size-4" /> Compose
      </button>
    </Boundary>
  );
}
