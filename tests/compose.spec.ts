import { expect, test } from '@playwright/test';

const visible = { visible: true };

test.describe('Compose and accounts', () => {
  test('a new message lands in Sent and in the other account’s inbox', async ({ page }) => {
    await page.goto('/inbox');
    await page.getByTestId('compose').filter(visible).click();
    await page.waitForURL(url => url.pathname === '/compose');
    const form = page.getByTestId('compose-form').filter(visible);
    await expect(form).toBeVisible();

    const subject = `Stamp compose test ${Date.now()}`;
    await form.getByLabel('To').selectOption({ label: 'Jonas Berg · jonas@stamp.dev' });
    await form.getByLabel('Subject').fill(subject);
    await form.getByLabel('Message').fill('Sent from the end-to-end suite.\n\nSecond paragraph, further down.');
    await form.getByLabel('Message').press('Meta+Enter');

    await page.waitForURL(url => url.pathname.startsWith('/sent/thr-'));
    await expect(page.getByRole('heading', { exact: true, level: 1, name: subject }).filter(visible)).toBeVisible();
    await expect(page.getByTestId('thread-latest').filter(visible)).toContainText('Second paragraph, further down.');

    await page.getByTestId('current-user').filter(visible).getByRole('button').first().click();
    await page
      .getByRole('button', { name: /Jonas Berg/ })
      .last()
      .click();
    await page.waitForURL(url => url.pathname === '/inbox');
    await expect(page.getByTestId('current-user').filter(visible)).toContainText('Jonas Berg');
    await expect(page.getByTestId('thread-row').filter(visible).filter({ hasText: subject })).toBeVisible();

    await page.getByTestId('current-user').filter(visible).getByRole('button').first().click();
    await page
      .getByRole('button', { name: /Mara Lindqvist/ })
      .last()
      .click();
    await expect(page.getByTestId('current-user').filter(visible)).toContainText('Mara Lindqvist');
  });
});
