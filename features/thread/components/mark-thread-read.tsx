'use client';

import { useEffect } from 'react';
import { markThreadRead } from '../thread-actions';

export function MarkThreadRead({ threadId }: { threadId: string }) {
  useEffect(() => {
    markThreadRead(threadId);
  }, [threadId]);

  return null;
}
