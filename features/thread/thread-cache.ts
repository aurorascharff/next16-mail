export const threadTags = {
  /** Subject, participants, bodies and attachments of one thread. Shared by every account that can see it. */
  detail: (threadId: string) => `thread:${threadId}`,
  /** One account's mailboxes: which threads sit where, and their read and starred state. */
  list: (userId: string) => `threads:${userId}`,
};
