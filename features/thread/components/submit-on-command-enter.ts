import type { KeyboardEvent } from 'react';

export function submitOnCommandEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }
}
