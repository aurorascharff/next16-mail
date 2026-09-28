import { cn } from '@/lib/utils';
import type { Label } from '../types/thread';

export function LabelChip({ className, label, size = 'sm' }: { className?: string; label: Label; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cn(
        'bg-card dark:bg-card-dark text-gray inline-flex shrink-0 items-center rounded-full font-medium whitespace-nowrap',
        size === 'sm' ? 'h-5 px-2 text-[11px]' : 'h-7 px-3 text-xs',
        className,
      )}
    >
      {label.name}
    </span>
  );
}
