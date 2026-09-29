import { getCurrentUser } from '@/features/user/user-queries';
import { getContacts } from '../thread-queries';
import { ComposePanelClient } from './compose-panel-client';

export async function ComposePanel() {
  const [user, contacts] = await Promise.all([getCurrentUser(), getContacts()]);
  return <ComposePanelClient contacts={contacts} from={user} />;
}
