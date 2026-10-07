import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';

const visible = { visible: true };

test.describe('Label (/label/[labelId])', () => {
  test('a sidebar label opens its database-backed route without activating search', async ({ page }) => {
    await page.goto('/inbox');
    const search = page.getByRole('searchbox', { name: 'Search mail' }).filter(visible);
    const design = page.getByRole('navigation', { name: 'Labels' }).getByRole('link', { name: 'Design' });

    await design.hover();
    await instant(page, async () => {
      await design.click();
      await page.waitForURL(url => url.pathname === '/label/design');
      await expect(page.getByRole('heading', { exact: true, level: 2, name: 'Design' })).toBeVisible();
      await expect(
        page.getByTestId('thread-row').filter(visible).filter({ hasText: 'Token rename is done' }),
      ).toBeVisible();
    });

    await expect(search).toHaveValue('');
    await expect(search).not.toBeFocused();
  });

  test('a label result and its back arrow stay in the label route', async ({ page }) => {
    await page.goto('/label/design');
    await page
      .getByTestId('thread-row')
      .filter(visible)
      .filter({ hasText: 'Token rename is done' })
      .getByRole('link')
      .click();
    await page.waitForURL(url => url.pathname === '/label/design/thr-design-tokens');

    await page.getByRole('link', { name: 'Back to list' }).click();
    await page.waitForURL(url => url.pathname === '/label/design');
    await expect(page.getByRole('heading', { exact: true, level: 2, name: 'Design' })).toBeVisible();
  });

  test('an unknown label shows the not found page', async ({ page }) => {
    await page.goto('/label/not-a-label');
    await expect(page.getByText('404')).toBeVisible();
  });
});
