import { expect, test } from '@playwright/test';

test.describe('Compose and accounts', () => {
  test('composing a message lands in Sent and in the other account’s inbox', async ({ page }) => {
    await page.goto('/inbox');
    await page.getByTestId('compose').click();
    const dialog = page.getByRole('dialog', { name: 'New message' });
    await expect(dialog).toBeVisible();

    const subject = `Relay compose test ${Date.now()}`;
    await dialog.getByLabel('To').selectOption({ label: 'Jonas Berg · jonas@relay.dev' });
    await dialog.getByLabel('Subject').fill(subject);
    await dialog.getByLabel('Message').fill('Sent from the end-to-end suite.\n\nSecond paragraph, below the fold.');
    await dialog.getByRole('button', { name: 'Send' }).click();

    await page.waitForURL(url => url.pathname.startsWith('/sent/thr-'));
    await expect(page.getByRole('heading', { level: 1, name: subject })).toBeVisible();
    await expect(page.getByTestId('thread-opening')).toHaveText('Sent from the end-to-end suite.');
    await expect(page.getByTestId('thread-body')).toContainText('Second paragraph, below the fold.');

    await page.getByRole('button', { name: 'Switch to Jonas Berg' }).click();
    await page.waitForURL(url => url.pathname === '/inbox');
    await expect(page.getByTestId('current-user')).toContainText('Jonas Berg');
    await expect(page.getByTestId('thread-row').filter({ hasText: subject })).toBeVisible();

    await page.getByRole('button', { name: 'Switch to Mara Lindqvist' }).click();
    await expect(page.getByTestId('current-user')).toContainText('Mara Lindqvist');
  });
});
