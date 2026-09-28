'use client';

import { cloneElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Boundary } from '@/components/internal/boundary';
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/ui/button-classes';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  render?: ReactElement<{ className?: string; children?: ReactNode }>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  className,
  render,
  type = 'button',
  disabled,
  ...props
}: Props) {
  const { pending } = useFormStatus();
  const isSubmit = type === 'submit';
  const isDisabled = disabled || (isSubmit && pending);
  const classes = buttonClasses({ className, size, variant });
  const content = (
    <>
      {isSubmit && pending && <Spinner />}
      {children}
    </>
  );

  if (render) {
    const renderClassName = render.props?.className;
    return (
      <Boundary label="Button" asChild>
        {cloneElement(render, { className: cn(classes, renderClassName), ...props }, content)}
      </Boundary>
    );
  }

  return (
    <Boundary label="Button" asChild>
      <button className={classes} disabled={isDisabled} type={type} {...props}>
        {content}
      </button>
    </Boundary>
  );
}
