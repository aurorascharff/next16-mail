import path from 'node:path';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaPg } from '@prisma/adapter-pg';
import { normalizeDatabaseUrl } from './database-url';

export const DEFAULT_DATABASE_URL = 'file:./prisma/dev.db';

export function isSqliteUrl(url: string) {
  return url.startsWith('file:');
}

export function createAdapter(url: string, options: { max?: number } = {}) {
  if (isSqliteUrl(url)) {
    return new PrismaBetterSqlite3({ url: path.resolve(process.cwd(), url.slice('file:'.length)) });
  }
  return new PrismaPg({
    connectionString: normalizeDatabaseUrl(url),
    idleTimeoutMillis: 10_000,
    max: options.max ?? 3,
  });
}
