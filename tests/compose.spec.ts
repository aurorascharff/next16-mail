import { expect, test } from '@playwright/test';

const visible = { visible: true };

test.describe('Compose and accounts', () => {
  test('a new message lands in Sent and in the other mailbox', async ({ page }) => {
    await page.goto('/inbox');
    await page.getByTestId('compose').filter(visible).click();
    const form = page.getByTestId('compose-form').filter(visible);
    await expect(form).toBeVisible();

    const subject = `Stamp compose test ${Date.now()}`;
    await form.getByRole('combobox', { name: 'To' }).fill('lindqvist');
    await page.getByRole('option', { name: /mara@lindqvist\.no/ }).click();
    await form.getByRole('button', { exact: true, name: 'Bcc' }).click();
    await form.getByRole('combobox', { name: 'Bcc' }).fill('jonas');
    await page.getByRole('option', { name: /jonas@stamp\.dev/ }).click();
    await form.getByPlaceholder('Subject').fill(subject);
    await form.getByLabel('Message').fill('Sent from the end-to-end suite.\n\nSecond paragraph, further down.');
    await form.getByLabel('Message').press('Meta+Enter');

    await expect(page.getByTestId('compose-panel')).toHaveCount(0);
    await expect(page.getByText('Message sent')).toBeVisible();
    await expect(page).toHaveURL(/\/inbox$/);
    await page.getByRole('navigation', { name: 'Mailboxes' }).getByRole('link', { name: /Sent/ }).click();
    await page.waitForURL(url => url.pathname === '/sent');
    await expect(page.getByTestId('thread-row').filter(visible).filter({ hasText: subject })).toBeVisible();

    await page.getByTestId('current-user').filter(visible).getByRole('button').first().click();
    await page
      .getByRole('button', { name: /mara@lindqvist\.no/ })
      .last()
      .click();
    await page.waitForURL(url => url.pathname === '/inbox');
    await expect(page.getByTestId('current-user').filter(visible)).toHaveAttribute('data-account', 'mara@lindqvist.no');
    await expect(page.getByTestId('thread-row').filter(visible).filter({ hasText: subject })).toBeVisible();

    await page.getByTestId('current-user').filter(visible).getByRole('button').first().click();
    await page
      .getByRole('button', { name: /mara@stamp\.dev/ })
      .last()
      .click();
    await expect(page.getByTestId('current-user').filter(visible)).toHaveAttribute('data-account', 'mara@stamp.dev');
  });
});
