export const threadTags = {
  detail: (threadId: string) => `thread:${threadId}`,
  list: (userId: string) => `threads:${userId}`,
};
