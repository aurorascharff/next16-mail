export function ThreadListHeader({ leading, trailing }: { leading: React.ReactNode; trailing?: React.ReactNode }) {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between gap-3 border-b bg-white/90 px-4 backdrop-blur-md sm:px-5 dark:bg-black/90">
      <div className="flex min-w-0 items-center gap-3">{leading}</div>
      <div className="flex shrink-0 items-center gap-1">{trailing}</div>
    </div>
  );
}

export function ListTitle({ children, spaced = false }: { children: React.ReactNode; spaced?: boolean }) {
  return (
    <>
      {spaced ? (
        <button
          aria-checked={false}
          aria-label="Select all on this page"
          className="border-gray/50 bg-card dark:bg-card-dark ml-2 size-5 shrink-0 rounded-full border opacity-50"
          disabled
          role="checkbox"
          type="button"
        />
      ) : null}
      <h2 className="truncate text-sm font-semibold tracking-tight">{children}</h2>
    </>
  );
}
