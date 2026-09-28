import { cn } from '@/lib/utils';
import type { Label } from '../types/thread';
import type { CSSProperties } from 'react';

export function LabelChip({ className, label, size = 'sm' }: { className?: string; label: Label; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        size === 'sm' ? 'h-5 px-2 text-[11px]' : 'h-6 px-2.5 text-xs',
        className,
      )}
      style={
        {
          '--label': label.color,
          backgroundColor: 'color-mix(in oklab, var(--label) 10%, transparent)',
          borderColor: 'color-mix(in oklab, var(--label) 28%, transparent)',
          color: 'color-mix(in oklab, var(--label) 72%, currentColor)',
        } as CSSProperties
      }
    >
      <span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: label.color }} />
      {label.name}
    </span>
  );
}
