import { expect, test } from '@playwright/test';

test.describe('Search (/search)', () => {
  test('searching from the list header navigates and streams matching rows', async ({ page }) => {
    await page.goto('/inbox');
    await page.getByRole('searchbox', { name: 'Search mail' }).fill('deployment');
    await page.getByRole('searchbox', { name: 'Search mail' }).press('Enter');
    await page.waitForURL(url => url.pathname === '/search' && url.searchParams.get('q') === 'deployment');

    const rows = page.getByTestId('thread-row').filter({ visible: true });
    await expect(rows.filter({ hasText: 'Deployment failed: relay-web@7f3a2c1' })).toBeVisible();
    await expect(rows.filter({ hasText: 'Deployment succeeded: relay-web@e91bb04' })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: 'Search mail' })).toHaveValue('deployment');
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
      .filter({ visible: true })
      .filter({ hasText: 'Token rename is done' })
      .getByRole('link')
      .click();
    await page.waitForURL(url => url.pathname === '/archive/thr-design-tokens');
    await expect(page.getByRole('heading', { exact: true, level: 1, name: 'Token rename is done' })).toBeVisible();
  });
});
