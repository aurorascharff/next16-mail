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
    await expect(page.getByTestId('unread-inbox')).toHaveText(/\d+/);
    await expect(page.getByRole('heading', { exact: true, level: 2, name: 'Inbox' })).toBeVisible();
  });

  test('the inbox link is marked as the current page', async ({ page }) => {
    await page.goto('/inbox');
    const nav = page.getByRole('navigation', { name: 'Mailboxes' });
    await expect(nav.getByRole('link', { name: /Inbox/ })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: /Archive/ })).not.toHaveAttribute('aria-current', 'page');
  });

  test('switching mailboxes swaps the rows', async ({ page }) => {
    await page.goto('/inbox');
    await page
      .getByRole('navigation', { name: 'Mailboxes' })
      .getByRole('link', { name: /Archive/ })
      .click();
    await page.waitForURL(url => url.pathname === '/archive');
    await expect(page.getByRole('heading', { exact: true, level: 2, name: 'Archive' })).toBeVisible();
    await expect(
      page.getByTestId('thread-row').filter({ visible: true }).filter({ hasText: 'Token rename is done' }),
    ).toBeVisible();
  });

  test('an unknown mailbox shows the not found page', async ({ page }) => {
    await page.goto('/spam');
    await expect(page.getByText('404')).toBeVisible();
  });

  test('selecting rows shows bulk actions, and archiving them removes the rows', async ({ page }) => {
    await page.goto('/inbox');
    const rows = page.getByTestId('thread-row').filter({ visible: true });
    for (const subject of ['Ramen at 12?', 'Deployment failed: stamp-web@7f3a2c1']) {
      await rows.filter({ hasText: subject }).getByRole('checkbox').click();
    }
    await expect(page.getByText('2 selected')).toBeVisible();
    await page.getByRole('button', { exact: true, name: 'Archive' }).first().click();
    await expect(rows.filter({ hasText: 'Ramen at 12?' })).toHaveCount(0);
    await expect(rows.filter({ hasText: 'Deployment failed: stamp-web@7f3a2c1' })).toHaveCount(0);

    await page.goto('/archive');
    const archived = page.getByTestId('thread-row').filter({ visible: true });
    for (const subject of ['Ramen at 12?', 'Deployment failed: stamp-web@7f3a2c1']) {
      await archived.filter({ hasText: subject }).getByRole('checkbox').click();
    }
    await page.getByRole('button', { exact: true, name: 'Move to inbox' }).first().click();
    await expect(archived.filter({ hasText: 'Ramen at 12?' })).toHaveCount(0);
  });

  test('the pager moves through the inbox in pages of ten', async ({ page }) => {
    await page.goto('/inbox');
    const rows = page.getByTestId('thread-row').filter({ visible: true });
    await expect(rows).toHaveCount(10);
    await expect(page.getByText(/^1–10 of \d+$/)).toBeVisible();

    await page.getByRole('link', { name: 'Older' }).click();
    await page.waitForURL(url => url.pathname === '/inbox' && url.searchParams.get('page') === '2');
    await expect(page.getByText(/^11–\d+ of \d+$/)).toBeVisible();
    await expect(rows.first()).toBeVisible();

    await page.getByRole('link', { name: 'Newer' }).click();
    await page.waitForURL(url => url.pathname === '/inbox' && url.searchParams.get('page') === null);
    await expect(rows).toHaveCount(10);
  });
});
