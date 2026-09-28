'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { RecipientPicker } from './recipient-picker';
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
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const toggles = (
    <span className="text-gray flex shrink-0 gap-2 text-xs">
      {!showCc ? (
        <button className="hover:text-black dark:hover:text-white" onClick={() => setShowCc(true)} type="button">
          Cc
        </button>
      ) : null}
      {!showBcc ? (
        <button className="hover:text-black dark:hover:text-white" onClick={() => setShowBcc(true)} type="button">
          Bcc
        </button>
      ) : null}
    </span>
  );

  return (
    <>
      {showTo ? (
        <AddressRow id={`${idPrefix}-to`} label="To" trailing={toggles}>
          <RecipientPicker contacts={contacts} id={`${idPrefix}-to`} name="to" />
        </AddressRow>
      ) : (
        <div className="flex justify-end">{toggles}</div>
      )}
      {showCc ? (
        <AddressRow id={`${idPrefix}-cc`} label="Cc" onClose={() => setShowCc(false)}>
          <RecipientPicker contacts={contacts} id={`${idPrefix}-cc`} name="cc" />
        </AddressRow>
      ) : null}
      {showBcc ? (
        <AddressRow id={`${idPrefix}-bcc`} label="Bcc" onClose={() => setShowBcc(false)}>
          <RecipientPicker contacts={contacts} id={`${idPrefix}-bcc`} name="bcc" />
        </AddressRow>
      ) : null}
    </>
  );
}

function AddressRow({
  children,
  id,
  label,
  onClose,
  trailing,
}: {
  children: React.ReactNode;
  id: string;
  label: string;
  onClose?: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <label className="text-gray flex h-10 w-8 shrink-0 items-center text-xs font-semibold" htmlFor={id}>
        {label}
      </label>
      <div className="min-w-0 flex-1">{children}</div>
      <span className="flex h-10 shrink-0 items-center">
        {trailing}
        {onClose ? (
          <button
            aria-label={`Remove ${label}`}
            className="text-gray inline-flex size-6 items-center justify-center rounded-full hover:text-black dark:hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </span>
    </div>
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
