import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';

test.describe('Thread (/[mailbox]/[threadId])', () => {
  test('a hovered row prefetches the header, and the body waits for the navigation', async ({ page }) => {
    await page.goto('/inbox');
    const row = page
      .getByTestId('thread-row')
      .filter({ visible: true })
      .filter({ hasText: 'Prefetch budget on the inbox' });
    await expect(row).toBeVisible();

    // Intent: hover flips the row to prefetch={true}, which resolves the thread header for that link.
    await row.hover();
    // `instant()` pauses everything that a prefetch could not have produced, so the header must come from the
    // prefetchable part of the route and the body, behind `unstable_navigation()`, must not.

    await instant(page, async () => {
      await row.getByRole('link').click();
      await page.waitForURL(url => url.pathname === '/inbox/thr-prefetch-budget');
      await expect(
        page
          .getByRole('heading', { exact: true, level: 1, name: 'Prefetch budget on the inbox' })
          .filter({ visible: true }),
      ).toBeVisible();
      await expect(page.getByTestId('thread-opening').filter({ visible: true })).toContainText(
        'Quick one before standup',
      );
      await expect(page.getByTestId('thread-body').filter({ visible: true })).toHaveCount(0);
    });

    await expect(page.getByTestId('thread-body').filter({ visible: true })).toBeVisible();
    await expect(page.getByTestId('thread-body').filter({ visible: true })).toContainText(
      'On a 1440px screen we render 38 rows.',
    );
    await expect(page.getByRole('list', { name: 'Attachments' })).toContainText('prefetch-budget.xlsx');
  });

  test('opening an unread thread marks it read', async ({ page }) => {
    await page.goto('/inbox');
    const row = page
      .getByTestId('thread-row')
      .filter({ visible: true })
      .filter({ hasText: 'Intent-based prefetch hook' });
    await expect(row).not.toHaveAttribute('data-read', '');
    await row.getByRole('link').click();
    await page.waitForURL(url => url.pathname === '/inbox/thr-hover-hook');
    await expect(page.getByTestId('thread-body').filter({ visible: true })).toBeVisible();
    await expect(row).toHaveAttribute('data-read', '');
  });

  test('earlier messages are collapsed and a reply appends to the conversation', async ({ page }) => {
    await page.goto('/inbox/thr-reading-pane');
    await expect(
      page.getByRole('heading', { exact: true, level: 1, name: 'Reading pane explorations, header first' }),
    ).toBeVisible();
    await expect(page.getByTestId('thread-body').filter({ visible: true })).toBeVisible();
    await expect(page.getByText('Show 2 earlier messages')).toBeVisible();

    const reply = `Looks good, shipping it. ${Date.now()}`;
    await page.getByLabel('Reply').fill(reply);
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByTestId('thread-opening').filter({ visible: true })).toHaveText(reply);
    await expect(page.getByText('Show 3 earlier messages')).toBeVisible();
    await expect(page.getByLabel('Reply')).toHaveValue('');
  });

  test('starring from the header shows up in Starred', async ({ page }) => {
    await page.goto('/inbox/thr-standup-move');
    await expect(page.getByTestId('thread-body').filter({ visible: true })).toBeVisible();
    await page.getByRole('button', { exact: true, name: 'Star' }).first().click();
    await expect(page.getByRole('button', { name: 'Remove star' }).first()).toBeVisible();

    await page
      .getByRole('navigation', { name: 'Mailboxes' })
      .getByRole('link', { name: /Starred/ })
      .click();
    await page.waitForURL(url => url.pathname === '/starred');
    await expect(
      page.getByTestId('thread-row').filter({ visible: true }).filter({ hasText: 'Move standup to 09:45?' }),
    ).toBeVisible();

    await page.goto('/starred/thr-standup-move');
    await page.getByRole('button', { name: 'Remove star' }).first().click();
    await expect(page.getByRole('button', { exact: true, name: 'Star' }).first()).toBeVisible();
  });

  test('archiving removes the row and returns to the list', async ({ page }) => {
    await page.goto('/inbox/thr-lunch');
    await expect(page.getByTestId('thread-body').filter({ visible: true })).toBeVisible();
    await page.getByRole('button', { exact: true, name: 'Archive' }).first().click();
    await page.waitForURL(url => url.pathname === '/inbox');
    await expect(
      page.getByTestId('thread-row').filter({ visible: true }).filter({ hasText: 'Ramen at 12?' }),
    ).toHaveCount(0);

    await page.goto('/archive/thr-lunch');
    await page.getByRole('button', { name: 'Move to inbox' }).first().click();
    await page.waitForURL(url => url.pathname === '/archive');
    await expect(
      page.getByTestId('thread-row').filter({ visible: true }).filter({ hasText: 'Ramen at 12?' }),
    ).toHaveCount(0);
  });

  test('a thread from another account is not found', async ({ page }) => {
    await page.goto('/inbox/thr-jonas-research');
    await expect(page.getByText('Conversation not found.')).toBeVisible();
  });
});
