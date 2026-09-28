'use client';

import { Send } from 'lucide-react';
import { useActionState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import type { User } from '@/features/user/types/user';
import { composeMessage } from '../thread-actions';
import { AddressFields } from './address-fields';
import { submitOnCommandEnter } from './submit-on-command-enter';
import type { Participant } from '../types/thread';

export function ComposeForm({
  contacts,
  from,
  onDiscard,
}: {
  contacts: Participant[];
  from: User;
  onDiscard: () => void;
}) {
  const [state, formAction] = useActionState(composeMessage, null);

  return (
    <Boundary label="ComposeForm" asChild>
      <form action={formAction} className="flex flex-col gap-4" data-testid="compose-form">
        <p className="text-gray flex h-8 items-center px-1 text-xs">
          <span className="w-8 font-semibold">From</span>
          {from.name} <span className="mx-1.5">·</span> {from.email}
        </p>
        <AddressFields contacts={contacts} idPrefix="compose" />
        <Input autoComplete="off" id="compose-subject" maxLength={120} name="subject" placeholder="Subject" required />
        <Textarea
          aria-label="Message"
          className="min-h-56"
          id="compose-body"
          maxLength={4000}
          name="body"
          onKeyDown={submitOnCommandEnter}
          placeholder="Write your message"
          required
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-danger min-h-4 text-xs" role={state ? 'alert' : undefined}>
            {state?.error ?? ''}
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
