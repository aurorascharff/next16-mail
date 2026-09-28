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

export const PAGE_SIZE = 10;

export function parsePage(value: string | string[] | undefined) {
  const page = typeof value === 'string' ? Number.parseInt(value, 10) : 1;
  return Number.isFinite(page) && page > 0 ? page : 1;
}
