import { BrandMark } from '@/components/ui/brand-mark';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  body?: string;
  className?: string;
  children?: React.ReactNode;
};

export function EmptyState({ title, body, className, children }: Props) {
  return (
    <div
      className={cn(
        'border-divider dark:border-divider-dark flex flex-col items-center gap-3 rounded-lg border border-dashed px-5 py-16 text-center',
        className,
      )}
    >
      <BrandMark className="text-divider dark:text-divider-dark size-8" />
      <p className="text-sm font-medium text-black dark:text-white">{title}</p>
      {body ? <p className="text-muted max-w-xs text-sm">{body}</p> : null}
      {children}
    </div>
  );
}
