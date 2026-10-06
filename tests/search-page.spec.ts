import { expect, test } from '@playwright/test';

const visible = { visible: true };

test.describe('Search (/search)', () => {
  test('label navigation syncs the query into the search field', async ({ page }) => {
    await page.goto('/inbox');
    await page.getByRole('navigation', { name: 'Labels' }).getByRole('link', { name: 'Design' }).click();
    await page.waitForURL(url => url.pathname === '/search' && url.searchParams.get('q') === 'Design');
    await expect(page.getByRole('searchbox', { name: 'Search mail' })).toHaveValue('Design');

    await page.getByRole('navigation', { name: 'Mailboxes' }).getByRole('link', { name: /Inbox/ }).click();
    await page.waitForURL(url => url.pathname === '/inbox');
    await expect(page.getByRole('searchbox', { name: 'Search mail' })).toHaveValue('');
  });

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

  test('a result opens under the search route, so back returns to the results', async ({ page }) => {
    await page.goto('/search?q=token%20rename');
    await page
      .getByTestId('thread-row')
      .filter(visible)
      .filter({ hasText: 'Token rename is done' })
      .getByRole('link')
      .click();
    await page.waitForURL(
      url => url.pathname === '/search/thr-design-tokens' && url.searchParams.get('q') === 'token rename',
    );
    await expect(
      page.getByRole('heading', { exact: true, level: 1, name: 'Token rename is done' }).filter(visible),
    ).toBeVisible();
  });

  test('the back arrow on a search result returns to the same query', async ({ page }) => {
    await page.goto('/search/thr-design-tokens?q=token%20rename');
    await page.getByRole('link', { name: 'Back to list' }).click();
    await page.waitForURL(url => url.pathname === '/search' && url.searchParams.get('q') === 'token rename');
    await expect(
      page.getByTestId('thread-row').filter({ visible: true }).filter({ hasText: 'Token rename is done' }),
    ).toBeVisible();
  });
});
