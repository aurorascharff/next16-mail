import { cn } from '@/lib/utils';

const SIZES = {
  lg: 'size-10 text-sm',
  md: 'size-9 text-sm',
  sm: 'size-8 text-xs',
} as const;

export function UserAvatar({ name, size = 'md' }: { name: string; size?: keyof typeof SIZES }) {
  return (
    <span
      aria-hidden
      className={cn(
        'bg-accent/10 text-accent dark:bg-accent/15 flex shrink-0 items-center justify-center rounded-full font-semibold uppercase',
        SIZES[size],
      )}
    >
      {name.charAt(0)}
    </span>
  );
}
