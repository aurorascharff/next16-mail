'use client';

import * as Ariakit from '@ariakit/react';
import { Menu, X } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { createContext, Suspense, use, useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { IconButton } from '@/components/ui/icon-button';

const MobileSidebarContext = createContext<Ariakit.DialogStore | null>(null);

export function MobileSidebar({ children, sidebar }: { children: ReactNode; sidebar: ReactNode }) {
  const store = Ariakit.useDialogStore();
  const previousLocationRef = useRef<string | null>(null);

  return (
    <MobileSidebarContext value={store}>
      {children}
      <Suspense>
        <MobileSidebarRouteCloser previousLocationRef={previousLocationRef} store={store} />
      </Suspense>
      <Boundary label="MobileSidebar" asChild>
        <Ariakit.Dialog
          backdrop={<div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] md:hidden" />}
          className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-3rem))] flex-col border-r pt-[max(1rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[env(safe-area-inset-left)] shadow-2xl outline-none md:hidden"
          hideOnInteractOutside
          store={store}
          unmountOnHide
        >
          <Ariakit.DialogHeading className="sr-only">Stamp navigation</Ariakit.DialogHeading>
          <Ariakit.DialogDismiss
            aria-label="Close navigation"
            className="text-gray hover:bg-card dark:hover:bg-card-dark absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 grid size-9 place-items-center rounded-full hover:text-black dark:hover:text-white"
          >
            <X className="size-5" />
          </Ariakit.DialogDismiss>
          {sidebar}
        </Ariakit.Dialog>
      </Boundary>
    </MobileSidebarContext>
  );
}

function MobileSidebarRouteCloser({
  previousLocationRef,
  store,
}: {
  previousLocationRef: RefObject<string | null>;
  store: Ariakit.DialogStore;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    const previous = previousLocationRef.current;
    previousLocationRef.current = location;

    if (previous !== null && previous !== location) store.hide();
  }, [location, previousLocationRef, store]);

  return null;
}

export function MobileSidebarTrigger({ className }: { className?: string }) {
  const store = use(MobileSidebarContext);
  if (!store) return null;

  return (
    <Ariakit.DialogDisclosure
      render={
        <IconButton className={`md:hidden ${className ?? ''}`} label="Open navigation">
          <Menu className="size-5" />
        </IconButton>
      }
      store={store}
    />
  );
}
