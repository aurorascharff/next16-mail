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
    <span className="text-gray flex shrink-0 gap-2 pr-1 text-xs">
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
        <RecipientPicker contacts={contacts} id={`${idPrefix}-to`} name="to" prefix="To" trailing={toggles} />
      ) : (
        <div className="flex justify-end">{toggles}</div>
      )}
      {showCc ? (
        <RecipientPicker
          contacts={contacts}
          id={`${idPrefix}-cc`}
          name="cc"
          prefix="Cc"
          trailing={<CloseRow label="Remove Cc" onClick={() => setShowCc(false)} />}
        />
      ) : null}
      {showBcc ? (
        <RecipientPicker
          contacts={contacts}
          id={`${idPrefix}-bcc`}
          name="bcc"
          prefix="Bcc"
          trailing={<CloseRow label="Remove Bcc" onClick={() => setShowBcc(false)} />}
        />
      ) : null}
    </>
  );
}

function CloseRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      className="text-gray inline-flex size-6 shrink-0 items-center justify-center rounded-full hover:text-black dark:hover:text-white"
      onClick={onClick}
      type="button"
    >
      <X className="size-3.5" />
    </button>
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
