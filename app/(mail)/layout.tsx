import { Suspense } from 'react';
import { MailSidebar } from '@/components/mail-sidebar';
import { MailTopBar } from '@/components/mail-top-bar';
import { MobileTabBar } from '@/components/mobile-tab-bar';
import { ComposeDock } from '@/features/thread/components/compose-dock';
import { ComposeProvider } from '@/features/thread/providers/compose-provider';

export default function MailLayout({ children }: LayoutProps<'/'>) {
  return (
    <ComposeProvider>
      <div className="flex h-dvh flex-col pt-[env(safe-area-inset-top)]">
        <MailTopBar />
        <div className="flex min-h-0 flex-1">
          <MailSidebar />
          <main className="border-divider/70 dark:border-divider-dark/70 min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain md:rounded-tl-2xl md:border-t md:border-l">
            {children}
          </main>
        </div>
        <MobileTabBar />
      </div>
      <Suspense>
        <ComposeDock />
      </Suspense>
    </ComposeProvider>
  );
}
