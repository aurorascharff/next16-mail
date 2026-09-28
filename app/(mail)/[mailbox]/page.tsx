import { BrandMark } from '@/components/ui/brand-mark';

export default function MailboxPage() {
  return (
    <div className="hidden h-full place-items-center px-6 text-center lg:grid" data-testid="empty-pane">
      <div className="flex max-w-xs flex-col items-center gap-3">
        <BrandMark className="text-divider dark:text-divider-dark size-10" />
        <p className="text-sm font-medium">Select a conversation</p>
      </div>
    </div>
  );
}
