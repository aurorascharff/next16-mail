import { Suspense } from 'react';
import { MailSidebar, MailSidebarContent } from '@/components/mail-sidebar';
import { MailTopBar } from '@/components/mail-top-bar';
import { MobileSidebar } from '@/components/mobile-sidebar';
import { ComposePanel } from '@/features/thread/components/compose-panel';
import { ComposeProvider } from '@/features/thread/providers/compose-provider';

export default function MailLayout({ children }: LayoutProps<'/'>) {
  return (
    <ComposeProvider>
      <MobileSidebar sidebar={<MailSidebarContent drawer />}>
        <div className="flex h-dvh flex-col pt-[env(safe-area-inset-top)]">
          <MailTopBar />
          <div className="flex min-h-0 flex-1">
            <MailSidebar />
            <main
              className="border-divider/70 dark:border-divider-dark/70 min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain md:rounded-tl-2xl md:border-t md:border-l"
              data-mail-main
            >
              {children}
            </main>
          </div>
        </div>
      </MobileSidebar>
      <Suspense>
        <ComposePanel />
      </Suspense>
    </ComposeProvider>
  );
}
