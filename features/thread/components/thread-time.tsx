'use client';

import { useSyncExternalStore } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { formatFullDate, formatListDate } from '@/lib/utils';

function subscribeToMinute(callback: () => void) {
  const id = setInterval(callback, 60_000);
  return () => clearInterval(id);
}

export function ThreadTime({ className, iso }: { className?: string; iso: string }) {
  const label = useSyncExternalStore(
    subscribeToMinute,
    () => formatListDate(new Date(iso), new Date()),
    () => formatListDate(new Date(iso), new Date()),
  );

  return (
    <Boundary label="ThreadTime">
      <time className={className} dateTime={iso} suppressHydrationWarning title={formatFullDate(new Date(iso))}>
        {label}
      </time>
    </Boundary>
  );
}
