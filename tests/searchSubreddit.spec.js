const { test } = require('@playwright/test');

const { RedditSubredditSearchPage } =
  require('../page/redditSubredditSearchPage.po.js');

test.describe('Search subreddit', () => {
  test('Search and open subreddit post', async ({ page }) => {
    const reddit = new RedditSubredditSearchPage(page);

    await reddit.searchSubreddit('ksi');
    await reddit.pickFirstSubredditFromResults();
  });
});