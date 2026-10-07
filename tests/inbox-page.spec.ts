import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';

test.describe('Inbox (/inbox)', () => {
  test('initial load shows the mailbox shell before the rows stream in', async ({ baseURL, page }) => {
    await instant(
      page,
      async () => {
        await page.goto('/inbox');
        await expect(page.getByRole('link', { name: 'Stamp inbox' })).toBeVisible();
        await expect(
          page.getByRole('navigation', { name: 'Mailboxes' }).getByRole('link', { name: /Inbox/ }),
        ).toBeVisible();
        await expect(page.getByTestId('thread-row').filter({ visible: true })).toHaveCount(0);
      },
      { baseURL },
    );

    await expect(page.getByTestId('thread-row').filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { exact: true, level: 2, name: 'Inbox' })).toBeVisible();
  });
});
