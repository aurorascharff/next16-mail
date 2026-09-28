import { ViewTransition } from 'react';

const directions = { default: 'none', 'nav-back': 'nav-back', 'nav-forward': 'nav-forward' } as const;

// Links tag a navigation with nav-forward or nav-back; the slide itself only runs on small screens (see globals.css).
export function DirectionalTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition default="none" enter={directions} exit={directions}>
      {children}
    </ViewTransition>
  );
}
