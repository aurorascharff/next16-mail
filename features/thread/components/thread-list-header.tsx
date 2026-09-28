import { SearchForm } from './search-form';

/** Static top of the list column: search and the list title. Renders before any list data. */
export function ThreadListHeader({ children, title }: { children?: React.ReactNode; title: string }) {
  return (
    <div className="border-divider/60 dark:border-divider-dark/60 flex flex-col gap-3 border-b px-3 pt-3 pb-3">
      <SearchForm />
      <div className="flex h-7 items-center justify-between px-1">
        <h2 className="text-sm">{title}</h2>
        {children}
      </div>
    </div>
  );
}
