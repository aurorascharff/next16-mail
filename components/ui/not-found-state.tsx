import { BrandMark } from '@/components/ui/brand-mark';
import { buttonClasses } from '@/components/ui/button-classes';
import { PrefetchLink } from '@/components/ui/prefetch-link';

export function NotFoundState({ body, title = 'Nothing here.' }: { body: string; title?: string }) {
  return (
    <div className="flex max-w-sm flex-col items-center gap-3">
      <BrandMark animated className="text-accent mb-1 size-10" />
      <p className="text-muted text-sm tabular-nums">404</p>
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted text-sm leading-6">{body}</p>
      <PrefetchLink className={buttonClasses({ className: 'mt-1', variant: 'secondary' })} href="/inbox">
        Back to inbox
      </PrefetchLink>
    </div>
  );
}
