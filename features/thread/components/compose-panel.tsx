'use client';

import { Minus, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Boundary } from '@/components/internal/boundary';
import type { User } from '@/features/user/types/user';
import { cn } from '@/lib/utils';
import { useCompose } from '../providers/compose-provider';
import { ComposeForm } from './compose-form';
import type { Participant } from '../types/thread';

export function ComposePanel({ contacts, from }: { contacts: Participant[]; from: User }) {
  const { close, minimize, state } = useCompose();
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    if (lastPathname.current !== pathname && pathname.startsWith('/sent/')) close();
    lastPathname.current = pathname;
  }, [close, pathname]);

  return (
    <Boundary label="ComposePanel" asChild>
      <div className="pointer-events-none fixed inset-0 z-40" style={{ viewTransitionName: 'compose-panel' }}>
        {state === 'closed' ? null : (
          <section
            aria-label="New message"
            className={cn(
              'border-divider dark:border-divider-dark pointer-events-auto absolute right-4 bottom-0 flex w-[min(36rem,calc(100vw-2rem))] flex-col rounded-t-2xl border border-b-0 bg-white shadow-2xl dark:bg-black',
              state === 'minimized' ? 'h-12' : 'max-h-[calc(100dvh-5rem)]',
            )}
            data-testid="compose-panel"
          >
            <header className="bg-card dark:bg-card-dark flex h-12 shrink-0 items-center justify-between rounded-t-2xl px-4">
              <button className="text-sm font-semibold tracking-tight" onClick={minimize} type="button">
                New message
              </button>
              <span className="flex items-center gap-1">
                <button
                  aria-label={state === 'minimized' ? 'Expand' : 'Minimize'}
                  className="text-gray inline-flex size-7 items-center justify-center rounded-full hover:text-black dark:hover:text-white"
                  onClick={minimize}
                  type="button"
                >
                  <Minus className="size-4" />
                </button>
                <button
                  aria-label="Close"
                  className="text-gray inline-flex size-7 items-center justify-center rounded-full hover:text-black dark:hover:text-white"
                  onClick={close}
                  type="button"
                >
                  <X className="size-4" />
                </button>
              </span>
            </header>
            <div className={cn('min-h-0 overflow-y-auto p-4', state === 'minimized' && 'hidden')}>
              <ComposeForm contacts={contacts} from={from} onDiscard={close} />
            </div>
          </section>
        )}
      </div>
    </Boundary>
  );
}
