// tests/sortfeed.spec.js
const { test, expect } = require('@playwright/test');
const { RedditFeedPage } = require('../page/redditFeedPage.po.js');

test.describe('Feed sorting', () => {
  test('Sorting changes the posts shown in the feed', async ({ page }) => {
    const feed = new RedditFeedPage(page);
    await feed.goto();

    await feed.sortBy('Best');
    const bestTitle = await feed.getFirstPostTitle();

    await feed.sortBy('New');
    await expect.poll(() => feed.getFirstPostTitle(), { timeout: 10000 })
      .not.toBe(bestTitle);
  });
});