export function ThreadListHeader({ children, title }: { children?: React.ReactNode; title: string }) {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 flex h-12 shrink-0 items-center justify-between border-b px-4 sm:px-5">
      <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      {children}
    </div>
  );
}
