import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { userTags } from './user-cache';
import { DEFAULT_ACCOUNT, SESSION_COOKIE } from './user-session';
import type { User } from './types/user';

const userSelect = { email: true, handle: true, id: true, name: true, title: true } as const;

/** The switchable demo accounts. Shared by every visitor, so it lives in the App Shell as static output. */
export async function getAccounts(): Promise<User[]> {
  'use cache';
  cacheLife('max');
  cacheTag(userTags.accounts);

  return prisma.user.findMany({ orderBy: { name: 'asc' }, select: userSelect, where: { account: true } });
}

/** The signed-in account, resolved from the session cookie. Private, so it is cached per visitor in the browser only. */
export async function getCurrentUser(): Promise<User> {
  'use cache: private';
  cacheLife({ stale: Infinity });
  cacheTag(userTags.current);

  const userId = (await cookies()).get(SESSION_COOKIE)?.value;
  const accounts = await getAccounts();
  return (
    accounts.find(account => account.id === userId) ??
    accounts.find(account => account.handle === DEFAULT_ACCOUNT) ??
    accounts[0]
  );
}

export async function verifyUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error('No account');
  return user;
}
