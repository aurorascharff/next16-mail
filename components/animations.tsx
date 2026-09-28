import { ViewTransition } from 'react';

export function NavForward({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      default="none"
      enter={{ default: 'none', 'nav-forward': 'nav-forward' }}
      exit={{ default: 'none', 'nav-back': 'nav-back' }}
    >
      {children}
    </ViewTransition>
  );
}

export function NavBack({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      default="none"
      enter={{ default: 'none', 'nav-back': 'nav-back' }}
      exit={{ default: 'none', 'nav-forward': 'nav-forward' }}
    >
      {children}
    </ViewTransition>
  );
}
