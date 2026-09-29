'use client';

import { Send } from 'lucide-react';
import { useActionState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { actionToast } from '@/components/ui/action-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { sendReply, unsendMessage } from '../thread-actions';
import { AddressFields } from './address-fields';
import { submitOnCommandEnter } from './submit-on-command-enter';
import type { Participant } from '../types/thread';

const INITIAL = { body: '', error: null as string | null, sent: 0 };

export function ReplyForm({ contacts, threadId, to }: { contacts: Participant[]; threadId: string; to: string }) {
  const [{ body, error, sent }, send] = useActionState(async (state: typeof INITIAL, formData: FormData) => {
    const result = await sendReply(formData);
    if (!result.ok) return { ...state, body: String(formData.get('body') ?? ''), error: result.error };
    actionToast('Reply sent', { label: 'Undo', run: () => unsendMessage(result.messageId) });
    return { body: '', error: null, sent: state.sent + 1 };
  }, INITIAL);

  return (
    <Boundary label="ReplyForm" asChild>
      <form action={send} className="mt-8 flex flex-col gap-3" data-testid="reply-form" key={sent}>
        <input name="threadId" type="hidden" value={threadId} />
        <label className="sr-only" htmlFor={`reply-${threadId}`}>
          Reply
        </label>
        <Textarea
          aria-invalid={error ? true : undefined}
          className="min-h-24"
          defaultValue={body}
          id={`reply-${threadId}`}
          name="body"
          onKeyDown={submitOnCommandEnter}
          placeholder={`Reply to ${to}…`}
          required
        />
        <AddressFields contacts={contacts} idPrefix={`reply-${threadId}`} showTo={false} />
        <div className="flex items-center justify-between gap-3">
          <p className="text-danger min-h-4 text-xs" role={error ? 'alert' : undefined}>
            {error ?? ''}
          </p>
          <Button className="w-24" type="submit" variant="accent">
            <Send className="size-3.5" /> Send
          </Button>
        </div>
      </form>
    </Boundary>
  );
}
