export const threadTags = {
  detail: (threadId: string) => `thread:${threadId}`,
  labels: 'labels',
  list: (userId: string) => `threads:${userId}`,
  state: (userId: string, threadId: string) => `thread-state:${userId}:${threadId}`,
};
