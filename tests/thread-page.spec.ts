import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';

const visible = { visible: true };

test.describe('Thread (/[mailbox]/[threadId])', () => {
  test('a hovered row prefetches the latest message, and earlier messages wait for the navigation', async ({
    page,
  }) => {
    await page.goto('/inbox');
    const row = page.getByTestId('thread-row').filter(visible).filter({ hasText: 'Reading pane explorations' });
    await expect(row).toBeVisible();
    await row.hover();

    await instant(page, async () => {
      await row.getByRole('link').click();
      await page.waitForURL(url => url.pathname === '/inbox/thr-reading-pane');
      await expect(
        page
          .getByRole('heading', { exact: true, level: 1, name: 'Reading pane explorations, header first' })
          .filter(visible),
      ).toBeVisible();
      await expect(page.getByTestId('thread-latest').filter(visible)).toContainText('Agreed on both.');
      await expect(page.getByTestId('reply-form').filter(visible)).toBeVisible();
      await expect(page.getByTestId('thread-earlier').filter(visible)).toHaveCount(0);
    });

    await expect(page.getByTestId('earlier-message').filter(visible)).toHaveCount(2);
    await expect(page.getByRole('list', { name: 'Attachments' }).filter(visible)).toContainText('reading-pane-c.png');
  });

  test('opening an unread thread marks it read', async ({ page }) => {
    await page.goto('/inbox');
    const row = page.getByTestId('thread-row').filter(visible).filter({ hasText: 'Intent-based prefetch hook' });
    await expect(row).not.toHaveAttribute('data-read', '');
    await row.getByRole('link').click();
    await page.waitForURL(url => url.pathname === '/inbox/thr-hover-hook');
    await expect(page.getByTestId('thread-latest').filter(visible)).toBeVisible();
    await expect(row).toHaveAttribute('data-read', '');
  });

  test('a reply becomes the latest message and the previous one moves down', async ({ page }) => {
    await page.goto('/inbox/thr-standup-move');
    await expect(page.getByTestId('earlier-message').filter(visible)).toHaveCount(1);

    const reply = `Fine by me. ${Date.now()}`;
    await page.getByLabel('Reply').fill(reply);
    await page.getByLabel('Reply').press('Meta+Enter');
    await expect(page.getByTestId('thread-latest').filter(visible)).toContainText(reply);
    await expect(page.getByTestId('earlier-message').filter(visible)).toHaveCount(2);
    await expect(page.getByLabel('Reply')).toHaveValue('');
  });

  test('starring from the toolbar shows up in Starred', async ({ page }) => {
    await page.goto('/inbox/thr-typography');
    await expect(page.getByTestId('thread-latest').filter(visible)).toBeVisible();
    const toolbar = page.getByTestId('thread-header').filter(visible);
    await toolbar.getByRole('button', { exact: true, name: 'Star' }).click();
    await expect(toolbar.getByRole('button', { name: 'Remove star' })).toBeVisible();

    await page
      .getByRole('navigation', { name: 'Mailboxes' })
      .getByRole('link', { name: /Starred/ })
      .click();
    await page.waitForURL(url => url.pathname === '/starred');
    await expect(
      page.getByTestId('thread-row').filter(visible).filter({ hasText: 'Typography pass on the thread view' }),
    ).toBeVisible();

    await page.goto('/starred/thr-typography');
    const starredToolbar = page.getByTestId('thread-header').filter(visible);
    await starredToolbar.getByRole('button', { name: 'Remove star' }).click();
    await expect(starredToolbar.getByRole('button', { exact: true, name: 'Star' })).toBeVisible();
  });

  test('archiving removes the row and returns to the list', async ({ page }) => {
    await page.goto('/inbox/thr-lunch');
    await expect(page.getByTestId('thread-latest').filter(visible)).toBeVisible();
    await page
      .getByTestId('thread-header')
      .filter(visible)
      .getByRole('button', { exact: true, name: 'Archive' })
      .click();
    await page.waitForURL(url => url.pathname === '/inbox');
    await expect(page.getByTestId('thread-row').filter(visible).filter({ hasText: 'Ramen at 12?' })).toHaveCount(0);

    await page.goto('/archive/thr-lunch');
    await page.getByTestId('thread-header').filter(visible).getByRole('button', { name: 'Move to inbox' }).click();
    await page.waitForURL(url => url.pathname === '/archive');
    await expect(page.getByTestId('thread-row').filter(visible).filter({ hasText: 'Ramen at 12?' })).toHaveCount(0);
  });

  test('archiving from a row fades it out until the server confirms', async ({ page }) => {
    await page.goto('/inbox');
    const row = page.getByTestId('thread-row').filter(visible).filter({ hasText: 'On-call rotation for October' });
    await row.hover();
    await row.getByRole('button', { exact: true, name: 'Archive' }).click();
    await expect(row).toHaveCount(0);

    await page.goto('/archive');
    const archived = page.getByTestId('thread-row').filter(visible).filter({ hasText: 'On-call rotation for October' });
    await expect(archived).toBeVisible();
    await archived.hover();
    await archived.getByRole('button', { name: 'Move to inbox' }).click();
    await expect(archived).toHaveCount(0);
  });

  test('a thread from another account is not found', async ({ page }) => {
    await page.goto('/inbox/thr-jonas-research');
    await expect(page.getByText('Conversation not found.')).toBeVisible();
  });
});
