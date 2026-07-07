const { test, expect } = require('@playwright/test');
const { RedditNavigation } = require('../page/redditNavigation.po.js');

test.describe('Logout', () => {
  test('Should logout successfully', async ({ page }) => {
    const nav = new RedditNavigation(page);

    // Already logged in via storageState
    await page.goto('/');

    await nav.openAccountMenu();
    await nav.logout();

    // Reddit usually stays on `/` after logout — assert the logged-out state.
    await expect(nav.loginButton).toBeVisible();
  });
});