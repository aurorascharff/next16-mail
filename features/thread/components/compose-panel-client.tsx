'use client';

import { Minus, X } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { Boundary } from '@/components/internal/boundary';
import type { User } from '@/features/user/types/user';
import { cn } from '@/lib/utils';
import { useCompose } from '../providers/compose-provider';
import { ComposeForm } from './compose-form';
import type { Participant } from '../types/thread';

function subscribe() {
  return () => {};
}

export function ComposePanelClient({ contacts, from }: { contacts: Participant[]; from: User }) {
  const { close, minimize, state } = useCompose();
  // The panel streams in after the page; if Compose was clicked before that, hydrate closed first.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <Boundary label="ComposePanel" asChild>
      <div className="pointer-events-none fixed inset-0 z-40" style={{ viewTransitionName: 'compose-panel' }}>
        {!mounted || state === 'closed' ? null : (
          <section
            aria-label="New message"
            className={cn(
              'border-divider dark:border-divider-dark pointer-events-auto absolute inset-0 flex flex-col bg-white pt-[env(safe-area-inset-top)] sm:inset-auto sm:right-4 sm:bottom-0 sm:w-[min(36rem,calc(100vw-2rem))] sm:rounded-t-2xl sm:border sm:border-b-0 sm:pt-0 sm:shadow-2xl dark:bg-black',
              state === 'minimized' ? 'sm:h-12' : 'sm:max-h-[calc(100dvh-5rem)]',
            )}
            data-testid="compose-panel"
          >
            <header className="bg-card dark:bg-card-dark flex h-12 shrink-0 items-center justify-between px-4 sm:rounded-t-2xl">
              <button className="text-sm font-semibold tracking-tight" onClick={minimize} type="button">
                New message
              </button>
              <span className="flex items-center gap-1">
                <button
                  aria-label={state === 'minimized' ? 'Expand' : 'Minimize'}
                  className="text-gray hidden size-7 items-center justify-center rounded-full hover:text-black sm:inline-flex dark:hover:text-white"
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
            <div className={cn('min-h-0 flex-1 overflow-y-auto p-4', state === 'minimized' && 'sm:hidden')}>
              <ComposeForm contacts={contacts} from={from} onDiscard={close} />
            </div>
          </section>
        )}
      </div>
    </Boundary>
  );
}
