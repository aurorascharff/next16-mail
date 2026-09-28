import 'server-only';

import { PrismaClient } from '@/generated/prisma/client';
import { createAdapter, DEFAULT_DATABASE_URL, isSqliteUrl } from '@/lib/prisma-adapter';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const databaseUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: createAdapter(databaseUrl) });

export const usesSqlite = isSqliteUrl(databaseUrl);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
