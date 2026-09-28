<div align="center">

<img src="public/logo.svg" alt="Stamp" width="72" height="72" />

# Next 16 Mail "Stamp"

A Gmail-style mail client that demonstrates [Instant Navigations](https://nextjs.org/docs/app/guides/instant-navigation) in [Next.js 16.4](https://nextjs.org/blog/next-16-4), including the new [`navigation()`](https://nextjs.org/docs/app/api-reference/functions/navigation) API.

[**Live demo →**](https://next16-mail.vercel.app/)

</div>

---

The architecture follows the [Next.js App Architecture](https://github.com/aurorascharff/nextjs-app-architecture-skill) skill and the [Component Architecture for React Server Components](https://aurorascharff.no/posts/component-architecture-for-react-server-components/) blog post.

## Features

- **[Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)** cache mailbox rows, the latest message of a thread, and its history with `'use cache'`, name them with `cacheTag`, and set their lifetime with `cacheLife`. The signed-in account is resolved with [`'use cache: private'`](https://nextjs.org/docs/app/api-reference/directives/use-cache-private) and passed into every cached read.
- **[`navigation()`](https://nextjs.org/docs/app/api-reference/functions/navigation)** keeps a thread's history out of the App Shell and out of every per-link prefetch, while the history stays cached. Hovering a row only ever loads the newest message.
- **[Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching)** prefetches one shared App Shell per route. Mailbox links use `prefetch={true}`, and rows prefetch on hover, focus, or touch.
- **[Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data)** star, archive, mark read, reply, and compose on the server. New text is screened through the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway), and each mutation invalidates only the tags it changes with [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag).
- **[React Compiler](https://react.dev/learn/react-compiler)** memoizes components and hooks automatically, so the code needs no manual `useMemo` or `useCallback`.
- **[View Transitions](https://nextjs.org/docs/app/guides/view-transitions)** cross-fade content as it streams in from Suspense while the sidebar and list stay pinned.
- **[Async React](https://github.com/rickhanlonii/async-react)** keeps the UI interactive with `Suspense`, `useOptimistic` for stars and archiving, `useActionState` for the reply and compose forms, and transitions for search.

## Purpose of this demo

An inbox is a list of links to expensive pages. Prefetching every row renders every thread for a screen where the user opens two. Prefetching nothing leaves an empty reading pane on every click. Stamp splits a thread at the newest message and lets Next.js 16 deliver each part at the right moment.

| Read                            | How it is cached                                        | When it arrives                |
| ------------------------------- | ------------------------------------------------------- | ------------------------------ |
| Mailbox links and unread counts | `'use cache'` per account                               | In the App Shell               |
| The rows of a mailbox           | `'use cache'` per account and mailbox                   | With a mailbox link's prefetch |
| Subject and the latest message  | `'use cache'` per thread and account                    | With a hovered row's prefetch  |
| Earlier messages in the thread  | `'use cache'` per thread, after `unstable_navigation()` | On the navigation only         |

Opening a thread shows the newest message and the reply form at once, and the earlier messages stream in below. Because they are cached, the next visitor gets them without anyone having prefetched them.

## Getting started

Stamp runs on SQLite locally and Postgres in production, on a Next.js 16.4 canary. Copy `.env.example` to `.env.local`, then:

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can browse the data with `pnpm run prisma.studio`, or wipe and re-seed the database with `pnpm run prisma.reset`. Restart `next dev` after re-seeding, since cached reads outlive the rows they came from.

The seed gives one fictional person a work mailbox and a personal mailbox. Switch between them from the sidebar, and write from one to the other. Use the toolbar in the bottom right to turn **Prefetch** off and compare, or turn **Delays** on to watch the latest message arrive before the history. Set `VERCEL_AI_GATEWAY_TOKEN` to screen replies and new messages for spam and profanity.

<details>
<summary>Deploying with Postgres</summary>

The driver follows `DATABASE_URL`. A `file:` URL uses SQLite through `@prisma/adapter-better-sqlite3`, and a `postgresql://` URL uses Postgres through `@prisma/adapter-pg`. `prisma.config.ts` swaps the schema provider to match, so `prisma generate`, `db push` and `db seed` work against either. Point `DATABASE_URL` at your Postgres database and run the same three commands to seed production data.

</details>

## Testing

The end-to-end tests use [`@next/playwright`](https://nextjs.org/docs/app/guides/testing/playwright) with the [`instant()`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant) API to assert that a hovered row's latest message is available before the click and that the earlier messages only render after it. They run in CI.

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
- **[Prisma 7](https://www.prisma.io/)** on SQLite locally and PostgreSQL in production
- **[Ariakit](https://ariakit.org/)** for the accessible account menu
- **[Playwright](https://playwright.dev/)** with `@next/playwright` for end-to-end tests

## License

[MIT](LICENSE)
