<div align="center">

<img src="public/logo.svg" alt="Relay" width="72" height="72" />

# Next 16 Mail "Relay"

A mail client that demonstrates the new [`navigation()`](https://nextjs.org/docs/app/api-reference/functions/navigation) and [`prefetch()`](https://nextjs.org/docs/app/api-reference/functions/prefetch) APIs from [Next.js 16.4](https://nextjs.org/blog/next-16-4), on top of Cache Components and Partial Prefetching.

[**Live demo →**](https://next16-mail.vercel.app/)

</div>

---

The architecture follows the [Next.js App Architecture](https://github.com/aurorascharff/nextjs-app-architecture-skill) skill and the [Component Architecture for React Server Components](https://aurorascharff.no/posts/component-architecture-for-react-server-components/) blog post.

## Purpose of this demo

An inbox is a list of links to expensive pages. Prefetching every row would render every thread, bodies and attachments included, for a screen where the user opens two of them. Not prefetching leaves an empty reading pane on every click.

Relay splits a thread at the fold. Everything above it is cheap and worth having before the click; everything below it waits for the navigation:

| Read                                                | How it is cached                                        | When it arrives                |
| --------------------------------------------------- | ------------------------------------------------------- | ------------------------------ |
| Mailbox links and unread counts                     | `'use cache'` per account                               | In the App Shell               |
| The rows of a mailbox                               | `'use cache'` per account and mailbox                   | With a mailbox link's prefetch |
| Subject, sender, opening paragraph                  | `'use cache'` per thread and account                    | With a hovered row's prefetch  |
| The rest of the body, attachments, earlier messages | `'use cache'` per thread, after `unstable_navigation()` | On the navigation only         |

Rows are ordinary links until the pointer reaches them. A [hover-triggered prefetch](https://nextjs.org/docs/app/guides/prefetching#hover-triggered-prefetch) then flips the row to `prefetch={true}`, which resolves the thread header for that one row. Opening the thread shows the header immediately and streams the body in underneath it, and because the body is still cached, the second visitor gets it from the cache without anyone ever having prefetched it.

## Features

- **[Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)** cache mailbox rows, thread headers and thread bodies with `'use cache'`, name them with `cacheTag`, and give them a lifetime with `cacheLife`. The signed-in account is resolved with [`'use cache: private'`](https://nextjs.org/docs/app/api-reference/directives/use-cache-private) and passed into every cached read as an argument.
- **[`navigation()`](https://nextjs.org/docs/app/api-reference/functions/navigation)** keeps the thread body out of the App Shell and out of every per-link prefetch while letting it keep its cache lifetime, so hovering rows never downloads bodies.
- **[Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching)** prefetches one shared App Shell per route. Mailbox links use `prefetch={true}` so switching mailboxes is instant; rows prefetch on intent.
- **[Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data)** star, archive, mark read, reply and compose on the server, and invalidate only the tags they change with [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag).
- **[React Compiler](https://react.dev/learn/react-compiler)** memoizes components and hooks automatically, so the code needs no manual `useMemo` or `useCallback`.
- **[View Transitions](https://nextjs.org/docs/app/guides/view-transitions)** cross-fade the header and body as they stream in while the sidebar and list stay pinned.
- **[Async React](https://github.com/rickhanlonii/async-react)** keeps the UI interactive with `Suspense`, `useOptimistic` for stars and archiving, `useActionState` for the reply and compose forms, and transitions for search.

## Getting started

Relay runs on Postgres and a Next.js 16.4 canary, which `unstable_navigation()` needs. Copy `.env.example` to `.env.local` and set `DATABASE_URL`, either the commented local example or a hosted database, then:

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can browse the data with `pnpm run prisma.studio`, or wipe and re-seed the database with `pnpm run prisma.reset`.

Use the toolbar in the bottom right to turn **Prefetch** off and compare, and turn **Delays** on to watch the header arrive from the prefetch and the body arrive on the navigation. Two demo accounts share the seeded threads; switch between them from the sidebar.

<details>
<summary>Run locally without Postgres</summary>

Drop this prompt into your agent to swap the datasource for SQLite:

> Set up Relay to run locally on SQLite instead of Postgres. Keep both database adapter stacks installed so the production Postgres setup remains available. Swap `provider = "postgresql"` to `provider = "sqlite"` in `prisma/schema.prisma`. Replace `@prisma/adapter-pg` with `@prisma/adapter-better-sqlite3` in `lib/db.ts` and `prisma/seed.ts`, using `new PrismaBetterSqlite3({ url })` where `url` is `process.env.DATABASE_URL` with the `file:` prefix stripped, and skip `normalizeDatabaseUrl` for file URLs in `prisma.config.ts`. Remove the `mode: 'insensitive'` Prisma filter options since SQLite does not support them. Write `DATABASE_URL=file:./prisma/dev.db` to `.env.local`, then run `pnpm run prisma.push` and `pnpm run prisma.seed`.

The schema is otherwise identical, so the rest of the app behaves the same as production.

</details>

## Testing

The end-to-end tests use [`@next/playwright`](https://nextjs.org/docs/app/guides/testing/playwright) with the [`instant()`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant) API to assert that a hovered row's header is available before the click and that the body only renders after it, and they run in CI.

```bash
pnpm test:e2e
```

Static checks:

```bash
pnpm lint
pnpm typecheck
```

## Stack

- **[Next.js 16.4](https://nextjs.org/)** canary: App Router, Cache Components, Partial Prefetching, `navigation()`, Server Functions
- **[React 19.3](https://react.dev/)** with React Compiler: Suspense, View Transitions, `useOptimistic`
- **[TypeScript](https://www.typescriptlang.org/)** and **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Prisma 7](https://www.prisma.io/)** on PostgreSQL
- **[Ariakit](https://ariakit.org/)** for accessible dialogs
- **[Playwright](https://playwright.dev/)** with `@next/playwright` for end-to-end tests

## License

[MIT](LICENSE)
