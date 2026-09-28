import { Suspense, ViewTransition } from 'react';
import type { ReactNode } from 'react';

export function AnimatedSuspense({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <Suspense
      fallback={
        <ViewTransition default="none" exit="fade-out">
          {fallback}
        </ViewTransition>
      }
    >
      <ViewTransition default="none" enter="fade-in">
        {children}
      </ViewTransition>
    </Suspense>
  );
}
