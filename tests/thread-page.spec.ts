import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';

const visible = { visible: true };

test.describe('Thread (/[mailbox]/[threadId])', () => {
  test('a row in view prefetches the thread header, and message content waits for the navigation', async ({ page }) => {
    await page.goto('/inbox');
    const row = page.getByTestId('thread-row').filter(visible).filter({ hasText: 'Reading pane explorations' });
    await expect(row).toBeVisible();
    await page.context().addCookies([{ name: 'stamp-slow', url: page.url(), value: '1' }]);

    await instant(page, async () => {
      await row.getByRole('link').click();
      await page.waitForURL(url => url.pathname === '/inbox/thr-reading-pane');
      await expect(
        page
          .getByRole('heading', { exact: true, level: 1, name: 'Reading pane explorations, header first' })
          .filter(visible),
      ).toBeVisible();
      await expect(page.getByTestId('thread-latest').filter(visible)).toHaveCount(0);
      await expect(page.getByTestId('reply-form').filter(visible)).toHaveCount(0);
    });

    await expect(page.getByTestId('thread-latest').filter(visible)).toBeVisible();
    await expect(page.getByTestId('earlier-message').filter(visible)).toHaveCount(0);
    await expect(page.getByTestId('earlier-message').filter(visible).first()).toBeVisible();
    await expect(page.getByRole('list', { name: 'Attachments' }).filter(visible)).toContainText('reading-pane-c.png');

    await instant(page, async () => {
      await page.getByRole('link', { name: 'Back to list' }).click();
      await page.waitForURL(url => url.pathname === '/inbox');
      await expect(
        page.getByTestId('thread-row').filter(visible).filter({ hasText: 'Reading pane explorations' }),
      ).toBeVisible();
    });
  });
});
