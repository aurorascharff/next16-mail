import 'server-only';

import { cookies } from 'next/headers';

export const NO_PREFETCH_COOKIE = 'stamp-no-prefetch';
export const SLOW_COOKIE = 'stamp-slow';

export async function isPrefetchEnabled() {
  return !(await cookies()).has(NO_PREFETCH_COOKIE);
}

export async function isSlowEnabled() {
  return (await cookies()).has(SLOW_COOKIE);
}
