/* eslint-disable no-console */
import { config } from 'dotenv';
import { PrismaClient } from '../generated/prisma/client';
import { createAdapter, DEFAULT_DATABASE_URL } from '../lib/prisma-adapter';

config({ path: '.env.local' });
config({ path: '.env' });

const prisma = new PrismaClient({
  adapter: createAdapter(process.env.DATABASE_URL || DEFAULT_DATABASE_URL, { max: 1 }),
});

const users = [
  {
    account: true,
    email: 'mara@stamp.dev',
    handle: 'mara',
    id: 'mara',
    name: 'Mara Lindqvist',
    title: 'Staff engineer',
  },
  {
    account: true,
    email: 'jonas@stamp.dev',
    handle: 'jonas',
    id: 'jonas',
    name: 'Jonas Berg',
    title: 'Product designer',
  },
  { email: 'ingrid@stamp.dev', handle: 'ingrid', id: 'ingrid', name: 'Ingrid Solberg', title: 'Engineering manager' },
  { email: 'tomas@stamp.dev', handle: 'tomas', id: 'tomas', name: 'Tomas Aas', title: 'Backend engineer' },
  { email: 'priya@stamp.dev', handle: 'priya', id: 'priya', name: 'Priya Nair', title: 'Frontend engineer' },
  { email: 'leo@stamp.dev', handle: 'leo', id: 'leo', name: 'Leo Marchetti', title: 'Developer advocate' },
  { email: 'sofie@stamp.dev', handle: 'sofie', id: 'sofie', name: 'Sofie Dahl', title: 'Product manager' },
  { email: 'noah@stamp.dev', handle: 'noah', id: 'noah', name: 'Noah Kim', title: 'Security engineer' },
  { email: 'finn@stamp.dev', handle: 'finn', id: 'finn', name: 'Finn Haugen', title: 'Support lead' },
  { email: 'elin@stamp.dev', handle: 'elin', id: 'elin', name: 'Elin Ruud', title: 'Recruiter' },
  { email: 'deploys@stamp.dev', handle: 'deploys', id: 'deploys', name: 'Stamp Deploys', title: 'Automation' },
  { email: 'calendar@stamp.dev', handle: 'calendar', id: 'calendar', name: 'Stamp Calendar', title: 'Automation' },
];

const labels = [
  { color: '#6d5dfc', id: 'engineering', name: 'Engineering' },
  { color: '#0ea5e9', id: 'design', name: 'Design' },
  { color: '#f59e0b', id: 'launch', name: 'Launch' },
  { color: '#10b981', id: 'hiring', name: 'Hiring' },
  { color: '#ef4444', id: 'infra', name: 'Infra' },
  { color: '#ec4899', id: 'social', name: 'Social' },
];

type SeedAttachment = { name: string; size: number; type: string };
type SeedMessage = { from: string; to: string[]; hoursAgo: number; body: string; attachments?: SeedAttachment[] };
type SeedState = { user: string; mailbox?: 'inbox' | 'archive' | 'sent'; read?: boolean; starred?: boolean };
type SeedThread = { id: string; subject: string; labels?: string[]; messages: SeedMessage[]; states: SeedState[] };

const p = (...paragraphs: string[]) => paragraphs.join('\n\n');

const threads: SeedThread[] = [
  {
    id: 'thr-prefetch-budget',
    labels: ['engineering'],
    messages: [
      {
        attachments: [{ name: 'prefetch-budget.xlsx', size: 48_211, type: 'spreadsheet' }],
        body: p(
          'Quick one before standup: I pulled the numbers on how many per-link prefetches the inbox fires when you land on it cold, and it is a lot more than I expected.',
          'On a 1440px screen we render 38 rows. Every one of them is a `<Link prefetch>`, so every one of them wakes the server for a per-link prerender the moment it scrolls into view. That is 38 renders of the thread page, bodies included, for a screen where the median user opens two threads.',
          'I think we should move the rows to prefetch on intent instead. Hover, focus, or touch-start flips the row to `prefetch={true}`, and the default `<Link>` keeps prefetching the shared App Shell for free. Priya has a small hook for it already.',
          'The second half of the fix is what the prefetch actually renders. Right now it is the whole thread. If we gate the history behind `await navigation()`, the prefetch stops at the subject and the latest message, and the earlier messages only render once someone clicks. That is the part I would like to pair on.',
          'Numbers attached. The first tab is the current behavior, the second is the projection.',
        ),
        from: 'tomas',
        hoursAgo: 1.2,
        to: ['mara', 'priya'],
      },
    ],
    states: [{ user: 'mara' }],
    subject: 'Prefetch budget on the inbox',
  },
  {
    id: 'thr-reading-pane',
    labels: ['design'],
    messages: [
      {
        attachments: [
          { name: 'reading-pane-c.png', size: 812_004, type: 'image' },
          { name: 'reading-pane-d.png', size: 794_310, type: 'image' },
        ],
        body: p(
          'I finished the reading pane explorations and I think we have a winner, but I want your take on the header before I hand it to Priya.',
          'The header is the piece that shows up first on navigation, so it needs to feel like a complete thing on its own. Subject, labels, and the latest message in full. Then the earlier messages fade in underneath without shifting anything above it.',
          'Version C keeps the sender row at a fixed 44px so the message always starts at the same y. Version D lets the sender row grow when there are many recipients, which reads better but moves the fold around. I lean C.',
          'Figma link is in the attachment list. The frames are named after the stages: Shell, Prefetch, Navigation.',
        ),
        from: 'jonas',
        hoursAgo: 30,
        to: ['mara'],
      },
      {
        body: p(
          'C, for the reason you gave. The fold has to be predictable or the crossfade looks like a layout bug.',
          'One more thing while you are in there: the skeleton for the body should not animate every line. Two or three bars with the sweep, the rest flat. Twenty shimmering lines reads as flicker.',
        ),
        from: 'mara',
        hoursAgo: 27,
        to: ['jonas'],
      },
      {
        body: p(
          'Agreed on both. Updated the frames and swapped the skeleton to three animated bars over a flat block. Handing it over now.',
          'If you want to see the fold in motion, the prototype has the 900ms delay you asked for on the history so you can watch the latest message land first.',
        ),
        from: 'jonas',
        hoursAgo: 3.5,
        to: ['mara'],
      },
    ],
    states: [
      { starred: true, user: 'mara' },
      { mailbox: 'sent', read: true, user: 'jonas' },
    ],
    subject: 'Reading pane explorations, header first',
  },
  {
    id: 'thr-deploy-failed',
    labels: ['infra'],
    messages: [
      {
        body: p(
          'Deployment stamp-web@7f3a2c1 to production failed.',
          'The build stopped in `next build` while prerendering `/[mailbox]/[threadId]`. The route reads `cookies()` in a component that is not wrapped in a Suspense boundary, so the prerender cannot produce a static shell for it.',
          'Error: Route "/[mailbox]/[threadId]" used `cookies()` outside of a Suspense boundary. Wrap the component in `<Suspense>`, or move the read into a `"use cache: private"` function.',
          'Fix the route and push again, or roll back to stamp-web@e91bb04 from the deployments page.',
        ),
        from: 'deploys',
        hoursAgo: 5,
        to: ['mara', 'tomas'],
      },
    ],
    states: [{ user: 'mara' }],
    subject: 'Deployment failed: stamp-web@7f3a2c1',
  },
  {
    id: 'thr-launch-post',
    labels: ['launch'],
    messages: [
      {
        attachments: [{ name: 'launch-post-draft.md', size: 9_842, type: 'document' }],
        body: p(
          'Draft of the launch post is ready for a technical read. I kept it short, three sections, one code sample each.',
          'The framing I landed on is "the inbox that never shows you a spinner for the part you already know". Subject and the latest message arrive from the prefetch; the earlier messages arrive on the click. It is honest about what is cached and what is not, which I think readers appreciate more than a blanket "instant".',
          'The code samples are lifted straight from the app so they should stay in sync. If we rename `getThreadSummary` again I will hear about it.',
          'Can you check the paragraph about `navigation()` versus `connection()`? I want to be precise about why one keeps the cache lifetime and the other does not.',
        ),
        from: 'leo',
        hoursAgo: 8,
        to: ['mara', 'sofie'],
      },
      {
        body: p(
          'Reading it tonight. First reaction to the framing: yes. It matches how the demo actually feels.',
          'For the `connection()` paragraph, the distinction is that `connection()` waits for a real request, so everything below it becomes request-dependent and cannot be cached. `navigation()` only excludes the subtree from prefetches. The function below it can still say `use cache` and keep its lifetime, it just is not produced until someone navigates.',
        ),
        from: 'mara',
        hoursAgo: 6.5,
        to: ['leo', 'sofie'],
      },
    ],
    states: [{ read: true, starred: true, user: 'mara' }],
    subject: 'Launch post draft for a technical read',
  },
  {
    id: 'thr-onsite',
    labels: ['hiring'],
    messages: [
      {
        body: p(
          'Two candidates for the senior frontend role are through to onsite and I would love you on the systems panel for both.',
          'Thursday 10:00 and Friday 13:00, one hour each. The prompt is the one you wrote in the spring: design the loading sequence for a mailbox with a persistent sidebar, a list, and a reading pane, and explain what can be cached, what has to wait for the URL, and what has to wait for the click.',
          'Feedback in the usual form by end of day Friday if you can. Calendar invites coming separately.',
        ),
        from: 'elin',
        hoursAgo: 26,
        to: ['mara'],
      },
    ],
    states: [{ read: true, user: 'mara' }],
    subject: 'Onsite panels Thursday and Friday',
  },
  {
    id: 'thr-security-review',
    labels: ['engineering', 'infra'],
    messages: [
      {
        attachments: [{ name: 'thread-actions-review.pdf', size: 221_998, type: 'document' }],
        body: p(
          'Finished the review of the server actions in the thread feature. Overall it is in good shape, three notes.',
          'First, every action re-checks the session with `verifyUser()` before touching a row, and the mutations are scoped by both `userId` and `threadId`. Good. Keep it that way when the label actions land.',
          'Second, `sendReply` derives recipients from the thread instead of trusting the form. That closes the obvious hole where a client adds arbitrary recipients. I would still add a length cap on the body, which I see is already in the schema.',
          'Third, and this is the only real request: the compose action accepts any user id as `to`. Restrict it to the contacts the account can actually see, the same list the form renders, so an id from another tenant is rejected instead of creating a thread.',
          'Sign-off attached with the checklist.',
        ),
        from: 'noah',
        hoursAgo: 52,
        to: ['mara'],
      },
    ],
    states: [{ mailbox: 'archive', read: true, user: 'mara' }],
    subject: 'Security review: thread server actions',
  },
  {
    id: 'thr-standup-move',
    messages: [
      {
        body: p(
          'Proposal: move standup from 09:15 to 09:45 starting next week. Half the team is on the 08:52 train and joins from the platform, which is fine for a status update but not for the design discussions we keep having in it.',
          'If nobody objects by Wednesday I will update the invite.',
        ),
        from: 'ingrid',
        hoursAgo: 20,
        to: ['mara', 'tomas', 'priya', 'jonas'],
      },
      {
        body: p('No objection, 09:45 is better for me too.'),
        from: 'priya',
        hoursAgo: 19,
        to: ['ingrid', 'mara', 'tomas', 'jonas'],
      },
    ],
    states: [{ read: true, user: 'mara' }, { user: 'jonas' }],
    subject: 'Move standup to 09:45?',
  },
  {
    id: 'thr-hover-hook',
    labels: ['engineering'],
    messages: [
      {
        body: p(
          'Here is the intent-based prefetch hook Tomas mentioned. It is small enough to paste.',
          'The idea: the row is a normal `<Link>`, so it gets the shared App Shell prefetch like everything else. On pointer enter, focus, or touch start we flip local state and the link becomes `prefetch={true}`, which asks for the per-link prefetch for that one row. The list never fires more than a handful of them, and only for rows the user is actually looking at.',
          'I also wired it to the demo toolbar. When Prefetch is off the hook returns `null` and rows stay on the shell-only path so you can compare.',
          'One open question: should the first row prefetch eagerly? It is the one people open most. I left it off for now.',
        ),
        from: 'priya',
        hoursAgo: 4,
        to: ['mara', 'tomas'],
      },
    ],
    states: [{ user: 'mara' }],
    subject: 'Intent-based prefetch hook',
  },
  {
    id: 'thr-offsite',
    labels: ['social'],
    messages: [
      {
        body: p(
          'Offsite is confirmed for the last week of October, three days in Bergen. Travel on Tuesday, sessions Wednesday and Thursday, home Friday.',
          'Please fill in the dietary form by Friday. Also, if you want to run a session, reply with a title and a rough length. I have two slots left on Thursday afternoon.',
          'Rain is likely. It is Bergen.',
        ),
        from: 'sofie',
        hoursAgo: 72,
        to: ['mara', 'jonas', 'tomas', 'priya', 'leo', 'noah', 'ingrid'],
      },
      {
        body: p(
          'Session proposal: "Three stages of a navigation", 40 minutes. Shell, prefetch, navigation, with the inbox as the running example. I will bring the slow-mode toggle.',
        ),
        from: 'mara',
        hoursAgo: 70,
        to: ['sofie'],
      },
      {
        body: p('Booked for Thursday 14:00. Bring the toggle.'),
        from: 'sofie',
        hoursAgo: 69,
        to: ['mara'],
      },
    ],
    states: [
      { read: true, user: 'mara' },
      { read: true, user: 'jonas' },
    ],
    subject: 'Offsite confirmed: Bergen, last week of October',
  },
  {
    id: 'thr-calendar-panel',
    messages: [
      {
        body: p(
          'Invitation: Senior frontend onsite, systems panel.',
          'Thursday 10:00 to 11:00, Room Fjord. Organizer: Elin Ruud. Attendees: Mara Lindqvist, Ingrid Solberg.',
          'Respond from the calendar to let the organizer know if you can make it.',
        ),
        from: 'calendar',
        hoursAgo: 25,
        to: ['mara'],
      },
    ],
    states: [{ read: true, user: 'mara' }],
    subject: 'Invitation: Senior frontend onsite, systems panel',
  },
  {
    id: 'thr-support-escalation',
    messages: [
      {
        attachments: [{ name: 'stale-pane.mov', size: 6_402_119, type: 'video' }],
        body: p(
          'Escalating a report from a customer on the enterprise plan. Their inbox shows the previous thread for a second when they click a new row, then swaps to the right one.',
          'I can reproduce it on staging with slow mode on. It looks like the reading pane keeps the old content while the new one streams, instead of showing the skeleton. Screen recording attached.',
          'They are on Safari 26 if that matters.',
        ),
        from: 'finn',
        hoursAgo: 9,
        to: ['mara', 'priya'],
      },
      {
        body: p(
          'Thanks Finn, that is a real one. The pane is keyed on the mailbox instead of the thread id, so React reuses the tree across threads and the transition holds the old content.',
          'Keying the boundary on the thread id fixes it. Priya is on it, should be in the next deploy.',
        ),
        from: 'mara',
        hoursAgo: 7,
        to: ['finn', 'priya'],
      },
    ],
    states: [{ read: true, user: 'mara' }],
    subject: 'Escalation: reading pane shows the previous thread',
  },
  {
    id: 'thr-design-tokens',
    labels: ['design', 'engineering'],
    messages: [
      {
        attachments: [{ name: 'tokens.json', size: 3_120, type: 'code' }],
        body: p(
          'The token rename is done on my side. `surface` is the sidebar and list background, `elevated` is the reading pane, `card` is hover and selected rows. Divider stays divider.',
          'I removed the three one-off greys we had for row states and mapped them to `card` at different opacities. Fewer names, same look.',
          'Accent is the new violet in both themes, slightly lighter in dark so it holds contrast against `elevated`. Contrast numbers in the attachment.',
        ),
        from: 'jonas',
        hoursAgo: 48,
        to: ['mara', 'priya'],
      },
    ],
    states: [
      { mailbox: 'archive', read: true, user: 'mara' },
      { mailbox: 'sent', read: true, user: 'jonas' },
    ],
    subject: 'Token rename is done',
  },
  {
    id: 'thr-deploy-ok',
    labels: ['infra'],
    messages: [
      {
        body: p(
          'Deployment stamp-web@e91bb04 to production succeeded.',
          'Build took 2m 41s. 14 routes prerendered, 2 routes with a runtime shell. No warnings.',
          'Preview and production URLs are on the deployments page.',
        ),
        from: 'deploys',
        hoursAgo: 28,
        to: ['mara', 'tomas'],
      },
    ],
    states: [{ mailbox: 'archive', read: true, user: 'mara' }],
    subject: 'Deployment succeeded: stamp-web@e91bb04',
  },
  {
    id: 'thr-conf-talk',
    labels: ['launch'],
    messages: [
      {
        body: p(
          'The conference accepted the talk. Forty minutes, main stage, second day.',
          'Working title is "Above the fold: what a prefetch should render". I want to open with the inbox demo live, slow mode on, and let the audience watch the latest message arrive before the history. Then walk through the three stages and how each read chooses its stage.',
          'Would you co-present the middle section? The caching decisions are yours and you explain them better than my slides do.',
        ),
        from: 'leo',
        hoursAgo: 96,
        to: ['mara'],
      },
      {
        body: p(
          'Yes. Send me the slide deck when you have a skeleton and I will fill in the middle.',
          'One request for the opening: do the first click with prefetch off, then the second with it on. The contrast does the talking.',
        ),
        from: 'mara',
        hoursAgo: 90,
        to: ['leo'],
      },
    ],
    states: [{ read: true, starred: true, user: 'mara' }],
    subject: 'Talk accepted: Above the fold',
  },
  {
    id: 'thr-oncall',
    labels: ['infra'],
    messages: [
      {
        body: p(
          'On-call rotation for October is out. You are primary the week of the 13th and secondary the week of the 27th, which overlaps the offsite. If that is a problem, swap with Tomas and tell me.',
          'Runbook links are on the wiki as usual. The new one for cache invalidation is worth a read before your week.',
        ),
        from: 'ingrid',
        hoursAgo: 55,
        to: ['mara'],
      },
    ],
    states: [{ read: true, user: 'mara' }],
    subject: 'On-call rotation for October',
  },
  {
    id: 'thr-lunch',
    labels: ['social'],
    messages: [
      {
        body: p('Ramen at 12? The place by the river has the miso back on the menu.'),
        from: 'tomas',
        hoursAgo: 2.5,
        to: ['mara', 'priya', 'jonas'],
      },
      {
        body: p('In. Meet at the lifts at 11:55.'),
        from: 'jonas',
        hoursAgo: 2.3,
        to: ['tomas', 'mara', 'priya'],
      },
    ],
    states: [{ user: 'mara' }, { mailbox: 'sent', read: true, user: 'jonas' }],
    subject: 'Ramen at 12?',
  },
  {
    id: 'thr-typography',
    labels: ['design'],
    messages: [
      {
        body: p(
          'Small typography pass on the thread view. Message bodies go from 14px to 15px with a 1.65 line height, and the max measure is 68ch. It reads a lot calmer on the wide pane.',
          'Subjects stay at 20px semibold. Sender names 14px semibold, addresses 13px muted. Timestamps tabular.',
          'Nothing changes in the list.',
        ),
        from: 'jonas',
        hoursAgo: 6,
        to: ['mara'],
      },
    ],
    states: [{ user: 'mara' }, { mailbox: 'sent', read: true, user: 'jonas' }],
    subject: 'Typography pass on the thread view',
  },
  {
    id: 'thr-referral',
    labels: ['hiring'],
    messages: [
      {
        body: p(
          'Thanks for the referral. I reached out to her this morning and she is interested in the platform role. First call is Monday.',
          'If there is anything you think I should know about how she likes to work, send it my way before then.',
        ),
        from: 'elin',
        hoursAgo: 75,
        to: ['mara'],
      },
    ],
    states: [{ mailbox: 'archive', read: true, user: 'mara' }],
    subject: 'Your referral for the platform role',
  },
  {
    id: 'thr-search-index',
    labels: ['engineering'],
    messages: [
      {
        body: p(
          'Search is on the query path now instead of the client. `searchThreads(userId, q)` is cached per query with the same list tag as the mailbox, so a reply or an archive invalidates results too.',
          'It is a plain `contains` over subject, sender, body, and label for now. If we outgrow it we can move to a real index, but with the current volume this is fine and it keeps the demo honest.',
          'The search page uses `searchParams.then()` so the input stays interactive while the results stream in. The results fade to 60% while the transition is pending.',
        ),
        from: 'priya',
        hoursAgo: 31,
        to: ['mara', 'tomas'],
      },
    ],
    states: [{ read: true, user: 'mara' }],
    subject: 'Search moved to the query path',
  },
  {
    id: 'thr-feature-flags',
    labels: ['engineering'],
    messages: [
      {
        body: p(
          'Following up on the flag cleanup. `readingPaneV2` and `hoverPrefetch` are both at 100% for two weeks now. I would like to delete both flags and the old code paths this sprint.',
          'The only consumer left is the e2e suite, which still toggles `hoverPrefetch` off for one test. I will rewrite that test to use the demo toolbar cookie instead.',
        ),
        from: 'tomas',
        hoursAgo: 100,
        to: ['mara'],
      },
      {
        body: p('Go ahead. Delete the flags, keep the cookie.'),
        from: 'mara',
        hoursAgo: 98,
        to: ['tomas'],
      },
    ],
    states: [{ mailbox: 'archive', read: true, user: 'mara' }],
    subject: 'Deleting readingPaneV2 and hoverPrefetch',
  },
  {
    id: 'thr-jonas-handoff',
    labels: ['design'],
    messages: [
      {
        body: p(
          'Handoff notes for the compose dialog.',
          'It opens from the sidebar button and from the keyboard shortcut. Recipient is a select over the contacts the account can see, subject is a single line, body is a textarea that grows to 12 lines then scrolls. Send is the only primary action.',
          'Errors show inline under the field, never as a toast. On success the dialog closes and the app navigates to the new thread in Sent.',
        ),
        from: 'jonas',
        hoursAgo: 12,
        to: ['priya', 'mara'],
      },
    ],
    states: [
      { read: true, user: 'mara' },
      { mailbox: 'sent', read: true, user: 'jonas' },
    ],
    subject: 'Handoff: compose dialog',
  },
  {
    id: 'thr-jonas-research',
    labels: ['design'],
    messages: [
      {
        attachments: [{ name: 'inbox-research-notes.pdf', size: 402_118, type: 'document' }],
        body: p(
          'Sharing the notes from the five user sessions on the current inbox. The strongest signal is the one we expected: people notice the spinner in the reading pane far more than the one in the list, because the pane is where they were looking when they clicked.',
          'Three of five described the ideal as "show me the newest message immediately, the rest can follow". That is basically the prefetch stage.',
          'Full notes attached.',
        ),
        from: 'sofie',
        hoursAgo: 15,
        to: ['jonas'],
      },
    ],
    states: [{ user: 'jonas' }],
    subject: 'Notes from the inbox user sessions',
  },
  {
    id: 'thr-jonas-icons',
    labels: ['design'],
    messages: [
      {
        attachments: [{ name: 'icon-audit.csv', size: 2_204, type: 'spreadsheet' }],
        body: p(
          'Icon audit is done. We use 31 distinct icons, 27 from the shared set and 4 custom. The 4 custom ones can all be replaced with shared equivalents except the brand mark.',
          'List of replacements attached. None of them change meaning.',
        ),
        from: 'priya',
        hoursAgo: 40,
        to: ['jonas'],
      },
    ],
    states: [{ read: true, user: 'jonas' }],
    subject: 'Icon audit',
  },
  {
    id: 'thr-jonas-deploy',
    labels: ['infra'],
    messages: [
      {
        body: p(
          'Deployment stamp-design@1a9c0f2 to production succeeded.',
          'The token package is published as 2.4.0. Consumers pick it up on their next install.',
        ),
        from: 'deploys',
        hoursAgo: 47,
        to: ['jonas'],
      },
    ],
    states: [{ mailbox: 'archive', read: true, user: 'jonas' }],
    subject: 'Deployment succeeded: stamp-design@1a9c0f2',
  },
];

async function main() {
  console.log('Clearing tables…');
  await prisma.threadState.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.recipient.deleteMany();
  await prisma.message.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.label.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users and labels…');
  await prisma.user.createMany({ data: users });
  await prisma.label.createMany({ data: labels });

  console.log(`Seeding ${threads.length} threads…`);
  const now = Date.now();
  for (const thread of threads) {
    const latest = Math.min(...thread.messages.map(message => message.hoursAgo));
    await prisma.thread.create({
      data: {
        id: thread.id,
        labels: { connect: (thread.labels ?? []).map(id => ({ id })) },
        messages: {
          create: thread.messages.map((message, index) => ({
            attachments: {
              create: (message.attachments ?? []).map((attachment, attachmentIndex) => ({
                ...attachment,
                id: `${thread.id}-m${index + 1}-a${attachmentIndex + 1}`,
              })),
            },
            body: message.body,
            fromId: message.from,
            id: `${thread.id}-m${index + 1}`,
            recipients: { create: message.to.map(userId => ({ kind: 'to', userId })) },
            sentAt: new Date(now - message.hoursAgo * 3_600_000),
          })),
        },
        states: {
          create: thread.states.map(state => ({
            mailbox: state.mailbox ?? 'inbox',
            read: state.read ?? false,
            starred: state.starred ?? false,
            userId: state.user,
          })),
        },
        subject: thread.subject,
        updatedAt: new Date(now - latest * 3_600_000),
      },
    });
  }

  console.log('Done.');
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
