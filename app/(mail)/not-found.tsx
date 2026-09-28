import { NotFoundState } from '@/components/ui/not-found-state';

export default function NotFound() {
  return (
    <div className="grid h-full place-items-center px-6 text-center">
      <NotFoundState body="Check the link, or head back to your inbox." />
    </div>
  );
}
