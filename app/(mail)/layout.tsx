import { MailSidebar } from '@/components/mail-sidebar';
import { MailTopBar } from '@/components/mail-top-bar';
import { MobileTabBar } from '@/components/mobile-tab-bar';

export default function MailLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex h-dvh flex-col pt-[env(safe-area-inset-top)]">
      <MailTopBar />
      <div className="flex min-h-0 flex-1">
        <MailSidebar />
        <main className="border-divider/70 dark:border-divider-dark/70 min-h-0 min-w-0 flex-1 overflow-hidden md:rounded-tl-2xl md:border-t md:border-l">
          {children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
