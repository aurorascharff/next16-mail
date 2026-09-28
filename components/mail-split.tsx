/**
 * The two columns to the right of the sidebar: the list and the reading pane. Below `lg` only one is visible,
 * and the list hides itself when a page renders `data-reading-pane` (see globals.css).
 */
export function MailSplit({ children, list }: { children: React.ReactNode; list: React.ReactNode }) {
  return (
    <div className="mail-split grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,27rem)_minmax(0,1fr)]">
      <section
        aria-label="Conversation list"
        className="border-divider/70 dark:border-divider-dark/70 flex min-h-0 flex-col overflow-hidden lg:border-r"
        data-thread-list
      >
        {list}
      </section>
      <div className="min-h-0 min-w-0 overflow-y-auto overscroll-contain">{children}</div>
    </div>
  );
}
