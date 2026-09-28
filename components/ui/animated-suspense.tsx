import { Suspense, ViewTransition } from 'react';
import type { ReactNode } from 'react';

// On a directional navigation the page slides as one piece, so the boundaries inside it sit that transition out.
const reveal = { default: 'auto', 'nav-back': 'none', 'nav-forward': 'none' } as const;

export function AnimatedSuspense({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <Suspense
      fallback={
        <ViewTransition default="none" exit={reveal}>
          {fallback}
        </ViewTransition>
      }
    >
      <ViewTransition default="none" enter={reveal}>
        {children}
      </ViewTransition>
    </Suspense>
  );
}
