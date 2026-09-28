import { cn } from '@/lib/utils';
import type { Label } from '../types/thread';

export function LabelChip({ className, label, size = 'sm' }: { className?: string; label: Label; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cn(
        'text-gray inline-flex shrink-0 items-center gap-1.5 font-medium whitespace-nowrap',
        size === 'sm' ? 'h-5 text-[11px]' : 'h-7 text-xs',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn('shrink-0 rounded-full', size === 'sm' ? 'size-2' : 'size-2.5')}
        style={{ backgroundColor: label.color }}
      />
      {label.name}
    </span>
  );
}
