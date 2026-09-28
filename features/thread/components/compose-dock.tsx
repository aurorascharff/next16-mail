import { getCurrentUser } from '@/features/user/user-queries';
import { getContacts } from '../thread-queries';
import { ComposePanel } from './compose-panel';

export async function ComposeDock() {
  const [user, contacts] = await Promise.all([getCurrentUser(), getContacts()]);
  return <ComposePanel contacts={contacts} from={user} />;
}
