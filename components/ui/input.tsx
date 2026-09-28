import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

const base =
  'border-divider placeholder-gray focus:border-accent focus:ring-accent/25 dark:border-divider-dark w-full rounded-md border bg-elevated px-3 text-sm text-black transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-card-dark dark:text-white';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(base, 'h-10', className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(base, 'h-10 appearance-none pr-8', className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(base, 'min-h-28 resize-y py-2 leading-relaxed', className)} {...props} />;
}
