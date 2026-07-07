// tests/upvoteDownvote.spec.js
const { test, expect } = require('@playwright/test');
const { RedditPostPage } = require('../page/redditPostPage.po.js');

test.describe('Upvote/Downvote', () => {
  test('Should upvote and downvote a post', async ({ page }) => {
    const postPage = new RedditPostPage(page);

    // Open subreddit (already authenticated via storageState)
    await page.goto('https://www.reddit.com/r/reactjs/', {
      waitUntil: 'domcontentloaded',
    });

    // Get first post link
    const firstPostLink = page
      .locator('article a[href*="/comments/"]')
      .first();

    await expect(firstPostLink).toBeVisible({ timeout: 15000 });

    const href = await firstPostLink.getAttribute('href');

    if (!href) {
      throw new Error('Could not find a valid post link');
    }

    // Properly handle absolute + relative URLs
    const postUrl = new URL(href, 'https://www.reddit.com').toString();

    await page.goto(postUrl, {
      waitUntil: 'domcontentloaded',
    });

    // Verify navigation
    await expect(page).toHaveURL(/\/comments\//i);

    // Verify the post title exists on the page object
    await expect(postPage.postTitle).toBeVisible({
      timeout: 15000,
    });

    // Actions
    await postPage.upvote();

    await page.waitForTimeout(1000); // small UI settle delay

    await postPage.downvote();
  });
});