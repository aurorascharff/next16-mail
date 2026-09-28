import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost';
export type ButtonSize = 'default' | 'lg' | 'sm' | 'icon';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50';

const sizes: Record<ButtonSize, string> = {
  default: 'h-9 px-4 text-sm',
  icon: 'size-9',
  lg: 'h-11 px-6 text-sm',
  sm: 'h-8 px-3 text-xs',
};

const variants: Record<ButtonVariant, string> = {
  accent: 'bg-accent text-white hover:bg-accent-hover',
  ghost: 'text-muted hover:bg-card hover:text-black dark:hover:bg-card-dark dark:hover:text-white',
  primary: 'bg-black text-white hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/90',
  secondary:
    'border border-divider bg-elevated text-black hover:border-gray/40 hover:bg-card dark:border-divider-dark dark:bg-transparent dark:text-white dark:hover:border-gray/30 dark:hover:bg-card-dark',
};

export function buttonClasses({
  className,
  size = 'default',
  variant = 'primary',
}: {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
} = {}) {
  return cn(base, sizes[size], variants[variant], className);
}
