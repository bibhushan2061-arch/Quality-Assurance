const { test, expect } = require('@playwright/test');
const { RedditSubredditPage } = require('../page/redditSubredditPage.po.js');

test.describe('Open subreddit', () => {
  test('Should open a subreddit and display posts', async ({ page }) => {
    const subredditPage = new RedditSubredditPage(page);

    await page.goto('https://www.reddit.com/r/reactjs/', {
      waitUntil: 'domcontentloaded'
    });

    await subredditPage.verifySubredditLoaded();
    await subredditPage.openFirstPost();

    await expect(page).toHaveURL(/\/comments\//i);
  });
});