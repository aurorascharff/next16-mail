import { SearchForm } from './search-form';

export function ThreadListHeader({ children, title }: { children?: React.ReactNode; title: string }) {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 flex flex-col gap-3 border-b px-4 pt-4 pb-3 sm:px-5">
      <SearchForm />
      <div className="flex h-7 items-center justify-between px-1">
        <h2 className="text-gray text-sm font-semibold tracking-tight">{title}</h2>
        {children}
      </div>
    </div>
  );
}
