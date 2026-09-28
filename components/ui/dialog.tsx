'use client';

import * as Ariakit from '@ariakit/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  store: Ariakit.DialogStore;
  title: string;
  description?: string;
  children: React.ReactNode;
  busy?: boolean;
  className?: string;
  initialFocus?: Ariakit.DialogProps['initialFocus'];
};

export function Dialog({ store, title, description, children, busy = false, className, initialFocus }: Props) {
  return (
    <Ariakit.Dialog
      store={store}
      initialFocus={initialFocus}
      unmountOnHide
      hideOnInteractOutside={!busy}
      hideOnEscape={!busy}
      backdrop={
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm dark:bg-black/60"
          style={{ viewTransitionName: 'dialog-backdrop' }}
        />
      }
      className={cn(
        'border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex max-h-[calc(100dvh-1.5rem)] flex-col rounded-2xl border p-5 shadow-2xl outline-none sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2',
        className,
      )}
      style={{ viewTransitionName: 'dialog' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Ariakit.DialogHeading className="text-lg font-semibold tracking-tight">{title}</Ariakit.DialogHeading>
          {description ? (
            <Ariakit.DialogDescription className="text-muted mt-0.5 text-sm">{description}</Ariakit.DialogDescription>
          ) : null}
        </div>
        <Ariakit.DialogDismiss
          aria-label="Close"
          className="text-muted hover:bg-card dark:hover:bg-card-dark -mt-1 -mr-1 grid size-9 shrink-0 place-items-center rounded-md transition-colors hover:text-black dark:hover:text-white"
          disabled={busy}
        >
          <X className="size-4" />
        </Ariakit.DialogDismiss>
      </div>
      {children}
    </Ariakit.Dialog>
  );
}
