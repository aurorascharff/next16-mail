'use client';

import { PenLine } from 'lucide-react';
import { Boundary } from '@/components/internal/boundary';
import { buttonClasses } from '@/components/ui/button-classes';
import { cn } from '@/lib/utils';
import { useCompose } from '../providers/compose-provider';

export function ComposeButton({ className, variant = 'sidebar' }: { className?: string; variant?: 'sidebar' | 'tab' }) {
  const { open } = useCompose();

  if (variant === 'tab') {
    return (
      <Boundary label="ComposeButton" asChild>
        <button className={className} data-testid="compose" onClick={open} type="button">
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
