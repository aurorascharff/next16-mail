'use client';

import { useId, useState } from 'react';
import { Input } from '@/components/ui/input';
import type { Participant } from '../types/thread';

export function AddressFields({
  contacts,
  idPrefix,
  showTo = true,
}: {
  contacts: Participant[];
  idPrefix: string;
  showTo?: boolean;
}) {
  const listId = useId();
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  return (
    <>
      <datalist id={listId}>
        {contacts.map(contact => (
          <option key={contact.id} value={contact.email}>
            {contact.name}
          </option>
        ))}
      </datalist>
      {showTo ? (
        <Field id={`${idPrefix}-to`} label="To">
          <div className="flex items-center gap-2">
            <Input
              autoComplete="off"
              id={`${idPrefix}-to`}
              list={listId}
              name="to"
              placeholder="name@example.com"
              required
            />
            <div className="text-gray flex shrink-0 gap-1 text-xs">
              {!showCc ? (
                <button
                  className="hover:text-black dark:hover:text-white"
                  onClick={() => setShowCc(true)}
                  type="button"
                >
                  Cc
                </button>
              ) : null}
              {!showBcc ? (
                <button
                  className="hover:text-black dark:hover:text-white"
                  onClick={() => setShowBcc(true)}
                  type="button"
                >
                  Bcc
                </button>
              ) : null}
            </div>
          </div>
        </Field>
      ) : (
        <div className="text-gray flex gap-2 text-xs">
          {!showCc ? (
            <button className="hover:text-black dark:hover:text-white" onClick={() => setShowCc(true)} type="button">
              Add Cc
            </button>
          ) : null}
          {!showBcc ? (
            <button className="hover:text-black dark:hover:text-white" onClick={() => setShowBcc(true)} type="button">
              Add Bcc
            </button>
          ) : null}
        </div>
      )}
      {showCc ? (
        <Field id={`${idPrefix}-cc`} label="Cc">
          <Input autoComplete="off" id={`${idPrefix}-cc`} list={listId} name="cc" placeholder="name@example.com" />
        </Field>
      ) : null}
      {showBcc ? (
        <Field id={`${idPrefix}-bcc`} label="Bcc">
          <Input autoComplete="off" id={`${idPrefix}-bcc`} list={listId} name="bcc" placeholder="name@example.com" />
        </Field>
      ) : null}
    </>
  );
}

export function Field({ children, id, label }: { children: React.ReactNode; id: string; label: string }) {
  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-semibold" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}
