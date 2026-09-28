import { cn } from '@/lib/utils';

export function RowButton({
  active,
  children,
  className,
  disabled,
  label,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'text-gray inline-flex size-6 items-center justify-center rounded-full transition-colors hover:bg-black/5 hover:text-black disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-white/10 dark:hover:text-white',
        active && 'text-accent hover:text-accent',
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}
