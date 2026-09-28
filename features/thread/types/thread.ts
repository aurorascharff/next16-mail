import type { Mailbox } from '../thread-mailboxes';

export type Participant = {
  id: string;
  name: string;
  email: string;
};

export type Label = {
  id: string;
  name: string;
  color: string;
};

export type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
};

/** One row in a mailbox. */
export type ThreadListItem = {
  id: string;
  subject: string;
  /** Opening line of the latest message. */
  snippet: string;
  /** Display names of everyone who wrote in the thread, the current account shown as "me". */
  participants: string[];
  messageCount: number;
  updatedAt: string;
  /** Where the thread sits for this account: `inbox`, `archive`, or `sent` for threads it started. */
  mailbox: string;
  read: boolean;
  starred: boolean;
  hasAttachments: boolean;
  labels: Label[];
};

/** Everything above the fold of a thread: what a per-link prefetch renders. */
export type ThreadSummary = {
  id: string;
  subject: string;
  labels: Label[];
  read: boolean;
  starred: boolean;
  mailbox: string;
  messageCount: number;
  latest: {
    id: string;
    from: Participant;
    to: Participant[];
    sentAt: string;
    /** The first paragraph of the latest message. */
    opening: string;
  };
};

/** One full message, rendered on the navigation. */
export type ThreadMessage = {
  id: string;
  from: Participant;
  to: Participant[];
  sentAt: string;
  paragraphs: string[];
  attachments: Attachment[];
};

export type MailboxCounts = Record<Mailbox, number>;
