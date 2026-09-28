'use client';

import { Boundary } from '@/components/internal/boundary';
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  label: string;
  href?: string;
  external?: boolean;
  size?: 'default' | 'sm';
} & ButtonHTMLAttributes<HTMLButtonElement>;

const iconButtonClass =
  'text-muted inline-flex shrink-0 items-center justify-center rounded-full transition-colors hover:bg-card hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-card-dark dark:hover:text-white';

const sizes = { default: 'size-8', sm: 'size-7' };

export function IconButton({
  children,
  className,
  external,
  href,
  label,
  size = 'default',
  type = 'button',
  ...props
}: Props) {
  const classes = cn(iconButtonClass, sizes[size], className);

  if (href) {
    return (
      <Boundary label="IconButton" asChild>
        <a
          aria-label={label}
          className={classes}
          href={href}
          title={label}
          {...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
        >
          {children}
        </a>
      </Boundary>
    );
  }

  return (
    <Boundary label="IconButton" asChild>
      <button aria-label={label} className={classes} title={label} type={type} {...props}>
        {children}
      </button>
    </Boundary>
  );
}
