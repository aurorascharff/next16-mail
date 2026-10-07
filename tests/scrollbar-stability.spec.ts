import { expect, test } from '@playwright/test';

test.describe('Scrollable mail surfaces', () => {
  test('reserve their scrollbar gutter before streamed content changes their height', async ({ page }) => {
    await page.goto('/inbox');
    await expect(page.locator('.thread-results')).toHaveCSS('scrollbar-gutter', 'stable');

    await page.goto('/search?q=Design');
    await expect(page.locator('.thread-results')).toHaveCSS('scrollbar-gutter', 'stable');

    await page.goto('/inbox/thr-reading-pane');
    await expect(page.locator('main > div > article')).toHaveCSS('scrollbar-gutter', 'stable');

    await page.goto('/search/thr-design-tokens?q=token%20rename');
    await expect(page.locator('main > div > article')).toHaveCSS('scrollbar-gutter', 'stable');
  });
});
