'use client';

import { Send } from 'lucide-react';
import { useActionState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/input';
import { composeMessage } from '../thread-actions';
import { submitOnCommandEnter } from './submit-on-command-enter';
import type { Participant } from '../types/thread';

export function ComposeForm({ contacts }: { contacts: Participant[] }) {
  const [state, formAction] = useActionState(composeMessage, null);

  return (
    <Boundary label="ComposeForm" asChild>
      <form action={formAction} className="flex flex-col gap-4" data-testid="compose-form">
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold" htmlFor="compose-to">
            To
          </label>
          <Select defaultValue="" id="compose-to" name="to" required>
            <option disabled value="">
              Choose a contact
            </option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name} · {contact.email}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold" htmlFor="compose-subject">
            Subject
          </label>
          <Input autoComplete="off" id="compose-subject" maxLength={120} name="subject" required />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold" htmlFor="compose-body">
            Message
          </label>
          <Textarea
            className="min-h-56"
            id="compose-body"
            maxLength={4000}
            name="body"
            onKeyDown={submitOnCommandEnter}
            required
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-danger min-h-4 text-xs" role={state ? 'alert' : undefined}>
            {state?.error ?? ''}
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
