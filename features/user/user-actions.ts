'use server';

import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { userTags } from './user-cache';
import { getAccounts } from './user-queries';
import { SESSION_COOKIE } from './user-session';

export async function switchUser(userId: string) {
  const parsed = z.string().trim().min(1).max(100).safeParse(userId);
  if (!parsed.success) return { error: 'That account could not be found.', ok: false as const };
  const accounts = await getAccounts();
  const next = accounts.find(account => account.id === parsed.data);
  if (!next) return { error: 'That account could not be found.', ok: false as const };

  (await cookies()).set(SESSION_COOKIE, next.id, { maxAge: 60 * 60 * 24 * 30, path: '/', sameSite: 'lax' });
  updateTag(userTags.current);
  return { ok: true as const };
}
