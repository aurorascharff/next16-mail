'use client';

import * as Ariakit from '@ariakit/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { cn } from '@/lib/utils';
import type { Participant } from '../types/thread';

export function RecipientPicker({
  contacts,
  id,
  name,
  placeholder = 'Add people',
  prefix,
  trailing,
}: {
  contacts: Participant[];
  id: string;
  name: string;
  placeholder?: string;
  prefix?: string;
  trailing?: React.ReactNode;
}) {
  const [selected, setSelected] = useState<Participant[]>([]);
  const [query, setQuery] = useState('');
  const combobox = Ariakit.useComboboxStore({ setValue: setQuery, value: query });
  const chosen = new Set(selected.map(contact => contact.id));
  const needle = query.trim().toLowerCase();
  const matches = contacts.filter(
    contact =>
      !chosen.has(contact.id) &&
      (contact.name.toLowerCase().includes(needle) || contact.email.toLowerCase().includes(needle)),
  );

  const typedEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(needle) && !contacts.some(contact => contact.email === needle) ? needle : null;

  function add(contact: Participant) {
    setSelected(previous => [...previous, contact]);
    combobox.setValue('');
  }

  function remove(id: string) {
    setSelected(previous => previous.filter(contact => contact.id !== id));
  }

  return (
    <Boundary label="RecipientPicker">
      <div className="relative">
        <div className="border-divider focus-within:border-accent focus-within:ring-accent/25 dark:border-divider-dark dark:bg-card-dark flex min-h-10 flex-wrap items-center gap-1 rounded-md border bg-white px-2 py-1 transition-colors focus-within:ring-2">
          {prefix ? (
            <label className="text-gray w-8 shrink-0 pl-1 text-xs font-semibold" htmlFor={id}>
              {prefix}
            </label>
          ) : null}
          {selected.map(contact => (
            <span
              className="bg-card flex h-7 items-center gap-1.5 rounded-full pr-1 pl-1 text-xs font-medium dark:bg-black"
              key={contact.id}
            >
              <UserAvatar name={contact.name} size="xs" />
              <span className="max-w-40 truncate">{contact.name}</span>
              <button
                aria-label={`Remove ${contact.name}`}
                className="text-gray inline-flex size-5 items-center justify-center rounded-full hover:bg-black/5 hover:text-black dark:hover:bg-white/10 dark:hover:text-white"
                onClick={() => remove(contact.id)}
                type="button"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          <Ariakit.Combobox
            autoComplete="off"
            autoSelect
            className="placeholder-gray min-w-32 flex-1 bg-transparent px-1 text-sm outline-none"
            id={id}
            onKeyDown={event => {
              if (event.key === 'Backspace' && query === '' && selected.length > 0) {
                remove(selected[selected.length - 1].id);
              }
            }}
            placeholder={selected.length === 0 ? placeholder : ''}
            store={combobox}
          />
          <input name={name} type="hidden" value={selected.map(contact => contact.email).join(',')} />
          {trailing}
        </div>
        <Ariakit.ComboboxPopover
          className="border-divider dark:border-divider-dark z-50 max-h-64 overflow-auto rounded-xl border bg-white py-1 shadow-xl dark:bg-black"
          gutter={4}
          sameWidth
          store={combobox}
        >
          {typedEmail ? (
            <Ariakit.ComboboxItem
              className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-black/5 data-[active-item]:bg-black/5 dark:hover:bg-white/5 dark:data-[active-item]:bg-white/5"
              hideOnClick
              onClick={() => add({ email: typedEmail, id: typedEmail, name: typedEmail })}
              setValueOnClick={false}
              value={typedEmail}
            >
              <UserAvatar name={typedEmail} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{typedEmail}</span>
                <span className="text-gray block truncate text-xs">Send to this address</span>
              </span>
            </Ariakit.ComboboxItem>
          ) : null}
          {matches.length === 0 && !typedEmail ? (
            <p className="text-gray px-3 py-2 text-sm">No contacts match, type a full address to use it</p>
          ) : (
            matches.map(contact => (
              <Ariakit.ComboboxItem
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors',
                  'hover:bg-black/5 data-[active-item]:bg-black/5 dark:hover:bg-white/5 dark:data-[active-item]:bg-white/5',
                )}
                hideOnClick
                key={contact.id}
                onClick={() => add(contact)}
                setValueOnClick={false}
                value={contact.email}
              >
                <UserAvatar name={contact.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{contact.name}</span>
                  <span className="text-gray block truncate text-xs">{contact.email}</span>
                </span>
              </Ariakit.ComboboxItem>
            ))
          )}
        </Ariakit.ComboboxPopover>
      </div>
    </Boundary>
  );
}
