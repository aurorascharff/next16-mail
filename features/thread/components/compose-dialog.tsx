'use client';

import * as Ariakit from '@ariakit/react';
import { PenLine } from 'lucide-react';
import { useActionState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { buttonClasses } from '@/components/ui/button-classes';
import { Dialog } from '@/components/ui/dialog';
import { Input, Select, Textarea } from '@/components/ui/input';
import { composeMessage } from '../thread-actions';
import type { Participant } from '../types/thread';

export function ComposeDialog({ contacts }: { contacts: Participant[] }) {
  const dialog = Ariakit.useDialogStore();
  const [state, formAction, isPending] = useActionState(composeMessage, null);

  return (
    <Boundary label="ComposeDialog">
      <Ariakit.DialogDisclosure
        className={buttonClasses({ className: 'w-full', size: 'lg', variant: 'accent' })}
        data-testid="compose"
        store={dialog}
      >
        <PenLine className="size-4" /> Compose
      </Ariakit.DialogDisclosure>
      <Dialog
        busy={isPending}
        description="Sent messages show up in Sent, and in the recipient’s inbox."
        store={dialog}
        title="New message"
      >
        <form action={formAction} className="mt-5 flex flex-col gap-4">
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
            <Textarea id="compose-body" maxLength={4000} name="body" required rows={8} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-danger min-h-4 text-xs" role={state ? 'alert' : undefined}>
              {state?.error ?? ''}
            </p>
            <Button className="w-24" type="submit" variant="accent">
              Send
            </Button>
          </div>
        </form>
      </Dialog>
    </Boundary>
  );
}
