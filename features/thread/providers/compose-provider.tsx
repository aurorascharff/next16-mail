'use client';

import { createContext, useContext, useState } from 'react';

type ComposeState = 'closed' | 'open' | 'minimized';

const ComposeContext = createContext<{
  state: ComposeState;
  open: () => void;
  close: () => void;
  minimize: () => void;
} | null>(null);

export function ComposeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ComposeState>('closed');
  return (
    <ComposeContext.Provider
      value={{
        close: () => setState('closed'),
        minimize: () => setState(current => (current === 'minimized' ? 'open' : 'minimized')),
        open: () => setState('open'),
        state,
      }}
    >
      {children}
    </ComposeContext.Provider>
  );
}

export function useCompose() {
  const context = useContext(ComposeContext);
  if (!context) throw new Error('useCompose must be used within ComposeProvider');
  return context;
}
