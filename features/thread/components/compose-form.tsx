'use client';

import { Send } from 'lucide-react';
import { useActionState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { actionToast } from '@/components/ui/action-toast';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import type { User } from '@/features/user/types/user';
import { useCompose } from '../providers/compose-provider';
import { composeMessage, unsendMessage } from '../thread-actions';
import { AddressFields } from './address-fields';
import { submitOnCommandEnter } from './submit-on-command-enter';
import type { Participant } from '../types/thread';

const INITIAL = { body: '', error: null as string | null, subject: '' };

export function ComposeForm({
  contacts,
  from,
  onDiscard,
}: {
  contacts: Participant[];
  from: User;
  onDiscard: () => void;
}) {
  const { close } = useCompose();
  const [{ body, error, subject }, send] = useActionState(async (_: typeof INITIAL, formData: FormData) => {
    const result = await composeMessage(formData);
    if (!result.ok) {
      return {
        body: String(formData.get('body') ?? ''),
        error: result.error,
        subject: String(formData.get('subject') ?? ''),
      };
    }
    close();
    actionToast('Message sent', { label: 'Undo', run: () => unsendMessage(result.messageId) });
    return INITIAL;
  }, INITIAL);

  return (
    <Boundary label="ComposeForm" asChild>
      <form action={send} className="flex flex-col gap-4" data-testid="compose-form">
        <p className="text-gray flex h-8 items-center px-1 text-xs">
          <span className="w-8 font-semibold">From</span>
          {from.name} <span className="mx-1.5">·</span> {from.email}
        </p>
        <AddressFields contacts={contacts} idPrefix="compose" />
        <Input
          autoComplete="off"
          defaultValue={subject}
          id="compose-subject"
          maxLength={120}
          name="subject"
          placeholder="Subject"
          required
        />
        <Textarea
          aria-label="Message"
          className="min-h-56"
          defaultValue={body}
          id="compose-body"
          maxLength={4000}
          name="body"
          onKeyDown={submitOnCommandEnter}
          placeholder="Write your message"
          required
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-danger min-h-4 text-xs" role={error ? 'alert' : undefined}>
            {error ?? ''}
          </p>
          <div className="flex items-center gap-2">
            <Button onClick={onDiscard} variant="ghost">
              Discard
            </Button>
            <Button className="w-24" type="submit" variant="accent">
              <Send className="size-3.5" /> Send
            </Button>
          </div>
        </div>
      </form>
    </Boundary>
  );
}
