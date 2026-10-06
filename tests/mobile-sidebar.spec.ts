import { expect, test } from '@playwright/test';

test.describe('Mobile sidebar', () => {
  test.use({ viewport: { height: 844, width: 390 } });

  test('stays open until navigation commits, including for a cached label route', async ({ page }) => {
    await page.goto('/inbox');

    const openNavigation = page.getByRole('button', { name: 'Open navigation' });
    const heading = page.getByRole('heading', { name: 'Stamp navigation' });
    const design = page.getByRole('link', { name: 'Design' });

    await openNavigation.evaluate(button => (button as HTMLButtonElement).click());
    await design.click();
    await page.waitForURL(url => url.pathname === '/search' && url.searchParams.get('q') === 'Design');
    await expect(heading).toHaveCount(0);

    await openNavigation.evaluate(button => (button as HTMLButtonElement).click());
    await page.getByRole('link', { name: /Inbox/ }).click();
    await page.waitForURL(url => url.pathname === '/inbox');
    await expect(heading).toHaveCount(0);

    await openNavigation.evaluate(button => (button as HTMLButtonElement).click());
    await design.evaluate(link => {
      link.addEventListener('click', event => event.preventDefault(), { once: true });
    });
    await design.click();

    await expect(page).toHaveURL(/\/inbox$/);
    await expect(heading).toBeVisible();

    await design.click();
    await page.waitForURL(url => url.pathname === '/search' && url.searchParams.get('q') === 'Design');
    await expect(heading).toHaveCount(0);
    await expect(page.getByRole('searchbox', { name: 'Search mail' })).toHaveValue('Design');
  });
});
