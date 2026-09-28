'use client';

import { Send } from 'lucide-react';
import { useActionState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { sendReply } from '../thread-actions';

export function ReplyForm({ threadId, to }: { threadId: string; to: string }) {
  const [state, formAction] = useActionState(sendReply, null);

  return (
    <Boundary label="ReplyForm" asChild>
      <form
        action={formAction}
        className="border-divider dark:border-divider-dark mt-8 flex flex-col gap-3 border-t pt-6"
        data-testid="reply-form"
        key={state?.ok ? state.sentAt : 'draft'}
      >
        <input name="threadId" type="hidden" value={threadId} />
        <label className="sr-only" htmlFor={`reply-${threadId}`}>
          Reply
        </label>
        <Textarea
          aria-invalid={state && !state.ok ? true : undefined}
          id={`reply-${threadId}`}
          name="body"
          placeholder={`Reply to ${to}…`}
          required
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-danger min-h-4 text-xs" role={state && !state.ok ? 'alert' : undefined}>
            {state && !state.ok ? state.error : ''}
          </p>
          <Button className="w-24" type="submit" variant="accent">
            <Send className="size-3.5" /> Send
          </Button>
        </div>
      </form>
    </Boundary>
  );
}
