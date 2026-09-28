import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';

test.describe('Inbox (/inbox)', () => {
  test('initial load shows the mailbox shell before the rows stream in', async ({ baseURL, page }) => {
    await instant(
      page,
      async () => {
        await page.goto('/inbox');
        await expect(page.getByRole('link', { name: 'Relay inbox' })).toBeVisible();
        await expect(
          page.getByRole('navigation', { name: 'Mailboxes' }).getByRole('link', { name: /Inbox/ }),
        ).toBeVisible();
        await expect(page.getByTestId('thread-row')).toHaveCount(0);
      },
      { baseURL },
    );

    await expect(page.getByTestId('thread-row').first()).toBeVisible();
    await expect(page.getByTestId('unread-inbox')).toHaveText(/\d+/);
    await expect(page.getByRole('heading', { level: 2, name: 'Inbox' })).toBeVisible();
  });

  test('the inbox link is marked as the current page and the reading pane is empty', async ({ page }) => {
    await page.goto('/inbox');
    const nav = page.getByRole('navigation', { name: 'Mailboxes' });
    await expect(nav.getByRole('link', { name: /Inbox/ })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: /Archive/ })).not.toHaveAttribute('aria-current', 'page');
    await expect(page.getByTestId('empty-pane')).toBeVisible();
  });

  test('switching mailboxes swaps the rows', async ({ page }) => {
    await page.goto('/inbox');
    await page
      .getByRole('navigation', { name: 'Mailboxes' })
      .getByRole('link', { name: /Archive/ })
      .click();
    await page.waitForURL(url => url.pathname === '/archive');
    await expect(page.getByRole('heading', { level: 2, name: 'Archive' })).toBeVisible();
    await expect(page.getByTestId('thread-row').filter({ hasText: 'Token rename is done' })).toBeVisible();
  });

  test('an unknown mailbox shows the not found page', async ({ page }) => {
    await page.goto('/spam');
    await expect(page.getByText('404')).toBeVisible();
  });
});
