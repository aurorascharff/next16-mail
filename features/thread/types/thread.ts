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

export type ThreadListItem = {
  id: string;
  subject: string;
  snippet: string;
  participants: string[];
  messageCount: number;
  updatedAt: string;
  mailbox: string;
  read: boolean;
  starred: boolean;
  hasAttachments: boolean;
  labels: Label[];
};

export type ThreadSummary = {
  id: string;
  subject: string;
  labels: Label[];
  read: boolean;
  starred: boolean;
  mailbox: string;
  messageCount: number;
  latest: Omit<ThreadMessage, 'paragraphs' | 'attachments'>;
};

export type ThreadMessage = {
  id: string;
  from: Participant;
  to: Participant[];
  cc: Participant[];
  sentAt: string;
  paragraphs: string[];
  attachments: Attachment[];
};

export type MailboxCounts = Record<Mailbox, number>;
