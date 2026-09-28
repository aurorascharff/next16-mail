'use client';

import { Send } from 'lucide-react';
import { useActionState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { buttonClasses } from '@/components/ui/button-classes';
import { Input, Textarea } from '@/components/ui/input';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import type { User } from '@/features/user/types/user';
import { composeMessage } from '../thread-actions';
import { AddressFields, Field } from './address-fields';
import { submitOnCommandEnter } from './submit-on-command-enter';
import type { Participant } from '../types/thread';

export function ComposeForm({ contacts, from }: { contacts: Participant[]; from: User }) {
  const [state, formAction] = useActionState(composeMessage, null);

  return (
    <Boundary label="ComposeForm" asChild>
      <form action={formAction} className="flex flex-col gap-4" data-testid="compose-form">
        <Field id="compose-from" label="From">
          <p
            className="border-divider dark:border-divider-dark text-gray flex h-10 items-center rounded-md border px-3 text-sm"
            id="compose-from"
          >
            {from.name} <span className="mx-1.5 hidden sm:inline">·</span>
            <span className="hidden sm:inline">{from.email}</span>
          </p>
        </Field>
        <AddressFields contacts={contacts} idPrefix="compose" />
        <Field id="compose-subject" label="Subject">
          <Input autoComplete="off" id="compose-subject" maxLength={120} name="subject" required />
        </Field>
        <Field id="compose-body" label="Message">
          <Textarea
            className="min-h-56"
            id="compose-body"
            maxLength={4000}
            name="body"
            onKeyDown={submitOnCommandEnter}
            required
          />
        </Field>
        <div className="flex items-center justify-between gap-3">
          <p className="text-danger min-h-4 text-xs" role={state ? 'alert' : undefined}>
            {state?.error ?? ''}
          </p>
          <div className="flex items-center gap-2">
            <PrefetchLink className={buttonClasses({ variant: 'ghost' })} href="/inbox">
              Discard
            </PrefetchLink>
            <Button className="w-24" type="submit" variant="accent">
              <Send className="size-3.5" /> Send
            </Button>
          </div>
        </div>
      </form>
    </Boundary>
  );
}
