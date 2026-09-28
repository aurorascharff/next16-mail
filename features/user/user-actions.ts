'use server';

import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { userTags } from './user-cache';
import { getAccounts } from './user-queries';
import { SESSION_COOKIE } from './user-session';

export async function switchUser(userId: string) {
  const accounts = await getAccounts();
  const next = accounts.find(account => account.id === userId) ?? accounts[0];

  (await cookies()).set(SESSION_COOKIE, next.id, { maxAge: 60 * 60 * 24 * 30, path: '/', sameSite: 'lax' });
  updateTag(userTags.current);
  return { ok: true as const };
}
