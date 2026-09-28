import fs from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';
import { normalizeDatabaseUrl } from './lib/database-url';
import { DEFAULT_DATABASE_URL, isSqliteUrl } from './lib/prisma-adapter';

config({ path: '.env.local' });
config({ path: '.env' });

const url = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
const sqlite = isSqliteUrl(url);

// The checked-in schema targets Postgres; a `file:` URL gets a SQLite copy so the client matches the driver.
function schemaFor(sqliteUrl: boolean) {
  const source = path.join('prisma', 'schema.prisma');
  if (!sqliteUrl) return source;
  const target = path.join('prisma', '.local', 'schema.prisma');
  const schema = fs
    .readFileSync(source, 'utf8')
    .replace('provider = "postgresql"', 'provider = "sqlite"')
    .replace('output   = "../generated/prisma"', 'output   = "../../generated/prisma"');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, schema);
  return target;
}

export default defineConfig({
  datasource: {
    url: sqlite ? url : normalizeDatabaseUrl(url),
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  schema: schemaFor(sqlite),
});
