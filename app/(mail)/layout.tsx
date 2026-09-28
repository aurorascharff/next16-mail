import { MailSidebar } from '@/components/mail-sidebar';
import { MobileTabBar } from '@/components/mobile-tab-bar';

export default function MailLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex h-dvh flex-col pt-[env(safe-area-inset-top)] md:flex-row">
      <MailSidebar />
      <main className="min-h-0 min-w-0 flex-1">{children}</main>
      <MobileTabBar />
    </div>
  );
}
