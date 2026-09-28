export const MAILBOXES = ['inbox', 'starred', 'sent', 'archive'] as const;

export type Mailbox = (typeof MAILBOXES)[number];

export const MAILBOX_LABELS: Record<Mailbox, string> = {
  archive: 'Archive',
  inbox: 'Inbox',
  sent: 'Sent',
  starred: 'Starred',
};

export function isMailbox(value: string): value is Mailbox {
  return (MAILBOXES as readonly string[]).includes(value);
}
