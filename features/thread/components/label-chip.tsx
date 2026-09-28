import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import type { Label } from '../types/thread';

export function LabelChip({ className, label, size = 'sm' }: { className?: string; label: Label; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full font-medium whitespace-nowrap',
        size === 'sm' ? 'h-5 px-2 text-[11px]' : 'h-7 px-3 text-xs',
        className,
      )}
      style={
        {
          backgroundColor: `color-mix(in oklab, ${label.color} 14%, transparent)`,
          color: `color-mix(in oklab, ${label.color} 80%, currentColor)`,
        } as CSSProperties
      }
    >
      {label.name}
    </span>
  );
}
