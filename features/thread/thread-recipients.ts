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
  const unknown = emails.find(email => !byEmail.has(email));
  if (unknown) return { error: `${unknown} is not in your contacts.`, ok: false };

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
