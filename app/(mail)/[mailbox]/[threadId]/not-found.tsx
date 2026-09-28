import { NotFoundState } from '@/components/ui/not-found-state';

export default function ThreadNotFound() {
  return (
    <div className="grid h-full place-items-center px-6 text-center" data-reading-pane>
      <NotFoundState
        body="This conversation is not in your mailboxes, or it was removed."
        title="Conversation not found."
      />
    </div>
  );
}
