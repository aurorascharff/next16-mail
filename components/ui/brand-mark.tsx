import { cn } from '@/lib/utils';

/** The Relay mark: an envelope flap folding down into a tile. Fill follows `currentColor`. */
export function BrandMark({ animated = false, className }: { animated?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('size-8', animated && 'mark-enter', className)}
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="currentColor" height="40" rx="12" width="40" />
      <path
        d="M10 14.5 20 22.5 30 14.5"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
      <path d="M10 25.5h20" stroke="white" strokeLinecap="round" strokeOpacity="0.55" strokeWidth="2.6" />
    </svg>
  );
}
