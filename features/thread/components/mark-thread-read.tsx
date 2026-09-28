'use client';

import { useEffect, useRef } from 'react';
import { markThreadRead } from '../thread-actions';

/** Posts the read receipt in the background once an unread thread is on screen. Renders nothing. */
export function MarkThreadRead({ threadId }: { threadId: string }) {
  const marked = useRef<string | null>(null);

  useEffect(() => {
    if (marked.current === threadId) return;
    marked.current = threadId;
    markThreadRead(threadId);
  }, [threadId]);

  return null;
}
