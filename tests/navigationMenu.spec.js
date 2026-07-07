const { test } = require('@playwright/test');
const { RedditNavigation } = require('../page/redditNavigation.po.js');

test.describe('Navigation menu', () => {
  test('Should open account menu and access logout link', async ({ page }) => {
    await page.goto('https://www.reddit.com/');

    const nav = new RedditNavigation(page);
    await nav.openAccountMenu();
  });
});