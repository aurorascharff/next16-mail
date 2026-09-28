import { cn } from '@/lib/utils';

const COLORS = [
  'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
];

const SIZES = {
  lg: 'size-10 text-sm',
  md: 'size-9 text-xs',
  sm: 'size-7 text-[0.625rem]',
} as const;

function initialsOf(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('');
}

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return COLORS[hash % COLORS.length];
}

export function UserAvatar({ name, size = 'md' }: { name: string; size?: keyof typeof SIZES }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold uppercase',
        colorFor(name),
        SIZES[size],
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
