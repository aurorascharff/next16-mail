'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="pointer-events-none fixed inset-0 z-9999" style={{ viewTransitionName: 'toaster' }}>
      <Sonner
        position="bottom-left"
        theme={resolvedTheme === 'light' ? 'light' : 'dark'}
        toastOptions={{ className: 'pointer-events-auto' }}
      />
    </div>
  );
}
