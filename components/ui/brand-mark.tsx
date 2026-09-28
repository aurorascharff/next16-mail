import { useId } from 'react';
import { cn } from '@/lib/utils';

const notches = [8, 16, 24, 32];

export function BrandMark({ animated = false, className }: { animated?: boolean; className?: string }) {
  const maskId = useId().replaceAll(':', '');

  return (
    <svg
      aria-hidden="true"
      className={cn('size-8', animated && 'mark-enter', className)}
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask id={maskId}>
        <rect fill="white" height="40" width="40" />
        {notches.map(offset => (
          <g fill="black" key={offset}>
            <circle cx={offset} cy="2" r="2.4" />
            <circle cx={offset} cy="38" r="2.4" />
            <circle cx="2" cy={offset} r="2.4" />
            <circle cx="38" cy={offset} r="2.4" />
          </g>
        ))}
      </mask>
      <rect fill="currentColor" height="36" mask={`url(#${maskId})`} rx="4" width="36" x="2" y="2" />
      <path d="M11 15.5 20 22l9-6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
      <rect height="16" rx="2" stroke="white" strokeWidth="2.4" width="20" x="10" y="12" />
    </svg>
  );
}
