'use client';

import { Send } from 'lucide-react';
import { useActionState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { sendReply } from '../thread-actions';
import { submitOnCommandEnter } from './submit-on-command-enter';

export function ReplyForm({ threadId, to }: { threadId: string; to: string }) {
  const [state, formAction] = useActionState(sendReply, null);

  return (
    <Boundary label="ReplyForm" asChild>
      <form
        action={formAction}
        className="mt-8 flex flex-col gap-3"
        data-testid="reply-form"
        key={state?.ok ? state.sentAt : 'draft'}
      >
        <input name="threadId" type="hidden" value={threadId} />
        <label className="sr-only" htmlFor={`reply-${threadId}`}>
          Reply
        </label>
        <Textarea
          aria-invalid={state && !state.ok ? true : undefined}
          className="min-h-24"
          id={`reply-${threadId}`}
          name="body"
          onKeyDown={submitOnCommandEnter}
          placeholder={`Reply to ${to}…`}
          required
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-danger min-h-4 text-xs" role={state && !state.ok ? 'alert' : undefined}>
            {state && !state.ok ? state.error : ''}
          </p>
          <div className="flex items-center gap-3">
            <kbd className="text-gray hidden text-[11px] sm:inline">⌘ ↵</kbd>
            <Button className="w-24" type="submit" variant="accent">
              <Send className="size-3.5" /> Send
            </Button>
          </div>
        </div>
      </form>
    </Boundary>
  );
}
