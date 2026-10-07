import { expect, test } from '@playwright/test';

const visible = { visible: true };

test.describe('Search (/search)', () => {
  test('typing in the search box navigates, keeps focus, and streams matching rows', async ({ page }) => {
    await page.goto('/inbox');
    const box = page.getByRole('searchbox', { name: 'Search mail' }).filter(visible);
    await box.pressSequentially('deploy');
    await page.waitForURL(url => url.pathname === '/search' && url.searchParams.get('q') === 'deploy');

    const focused = page.getByRole('searchbox', { name: 'Search mail' }).filter(visible);
    await expect(focused).toBeFocused();
    await expect(focused).toHaveValue('deploy');

    const rows = page.getByTestId('thread-row').filter(visible);
    await expect(rows.filter({ hasText: 'Deployment failed: stamp-web@7f3a2c1' })).toBeVisible();
    await expect(rows.filter({ hasText: 'Deployment succeeded: stamp-web@e91bb04' })).toBeVisible();
  });
});
