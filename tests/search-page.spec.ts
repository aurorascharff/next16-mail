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

  test('an empty query shows the search prompt, and no matches show an empty state', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByText('Search your mail')).toBeVisible();

    await page.goto('/search?q=zzzzzz');
    await expect(page.getByText('No results')).toBeVisible();
  });

  test('a result opens in the mailbox the thread lives in', async ({ page }) => {
    await page.goto('/search?q=token%20rename');
    await page
      .getByTestId('thread-row')
      .filter(visible)
      .filter({ hasText: 'Token rename is done' })
      .getByRole('link')
      .click();
    await page.waitForURL(url => url.pathname === '/archive/thr-design-tokens');
    await expect(
      page.getByRole('heading', { exact: true, level: 1, name: 'Token rename is done' }).filter(visible),
    ).toBeVisible();
  });
});
