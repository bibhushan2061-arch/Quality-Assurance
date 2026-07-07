const { test, expect } = require('@playwright/test');

const { RedditSubredditSearchPage } =
  require('../page/redditSubredditSearchPage.po.js');

const { RedditSubredditPage } =
  require('../page/redditSubredditPage.po.js');

test.describe('Search post', () => {
  test('Should open a post from a subreddit feed', async ({ page }) => {
    const search = new RedditSubredditSearchPage(page);
    const subredditPage = new RedditSubredditPage(page);

    await search.searchSubreddit('reactjs');
    await search.pickFirstSubredditFromResults();

    await subredditPage.openFirstPost();

    await expect(page).toHaveURL(/\/comments\//i);
  });
});