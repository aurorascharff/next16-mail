export const threadTags = {
  detail: (threadId: string) => `thread:${threadId}`,
  labels: 'labels',
  list: (userId: string) => `threads:${userId}`,
};
