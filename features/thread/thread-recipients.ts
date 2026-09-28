import 'server-only';

import { prisma } from '@/lib/db';

export type ResolvedRecipients =
  | { ok: true; recipients: { kind: 'to' | 'cc' | 'bcc'; userId: string; account: boolean }[] }
  | { ok: false; error: string };

export function splitAddresses(value: string | undefined) {
  return [
    ...new Set(
      (value ?? '')
        .split(/[,;\s]+/)
        .map(part => part.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

export async function resolveRecipients(
  userId: string,
  fields: { to: string[]; cc: string[]; bcc: string[] },
): Promise<ResolvedRecipients> {
  const emails = [...new Set([...fields.to, ...fields.cc, ...fields.bcc])];
  const contacts = await prisma.user.findMany({
    select: { account: true, email: true, id: true },
    where: {
      NOT: { id: userId },
      OR: [{ account: true }, { messages: { some: { thread: { states: { some: { userId } } } } } }],
      email: { in: emails },
    },
  });
  const byEmail = new Map(contacts.map(contact => [contact.email.toLowerCase(), contact]));
  for (const email of emails) {
    if (byEmail.has(email)) continue;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: `${email} is not a valid address.`, ok: false };
    const existing = await prisma.user.findUnique({
      select: { account: true, email: true, id: true },
      where: { email },
    });
    if (existing?.account || existing?.id === userId) return { error: `${email} is your own address.`, ok: false };
    const local = email.split('@')[0];
    const created =
      existing ??
      (await prisma.user.create({
        data: {
          email,
          handle: `${local}-${crypto.randomUUID().slice(0, 6)}`,
          id: `contact-${crypto.randomUUID().slice(0, 8)}`,
          name: local.replace(/[._-]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()),
          title: 'Contact',
        },
        select: { account: true, email: true, id: true },
      }));
    byEmail.set(email, created);
  }

  const seen = new Set<string>();
  const recipients: { kind: 'to' | 'cc' | 'bcc'; userId: string; account: boolean }[] = [];
  for (const [kind, list] of [
    ['to', fields.to],
    ['cc', fields.cc],
    ['bcc', fields.bcc],
  ] as const) {
    for (const email of list) {
      const contact = byEmail.get(email)!;
      if (seen.has(contact.id)) continue;
      seen.add(contact.id);
      recipients.push({ account: contact.account, kind, userId: contact.id });
    }
  }
  return { ok: true, recipients };
}
