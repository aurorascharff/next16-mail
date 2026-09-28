'use client';

import { BrandMark } from '@/components/ui/brand-mark';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function ErrorState({
  body,
  children,
  className,
  title,
  variant = 'section',
}: {
  body: string;
  children: ReactNode;
  className?: string;
  title: string;
  variant?: 'page' | 'section';
}) {
  if (variant === 'page') {
    return (
      <main className={cn('grid place-items-center px-6 text-center', className)}>
        <div className="flex max-w-sm flex-col items-center gap-3">
          <BrandMark animated className="text-accent mb-1 size-10" />
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted text-sm leading-6">{body}</p>
          <div className="mt-1">{children}</div>
        </div>
      </main>
    );
  }

  return (
    <div
      className={cn(
        'border-divider dark:border-divider-dark flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-5 py-10 text-center',
        className,
      )}
    >
      <BrandMark className="text-divider dark:text-divider-dark size-8" />
      <p className="text-sm font-medium text-black dark:text-white">{title}</p>
      <p className="text-muted max-w-xs text-sm">{body}</p>
      {children}
    </div>
  );
}
