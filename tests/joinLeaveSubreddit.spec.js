// tests/joinLeaveSubreddit.spec.js
const { test, expect } = require('@playwright/test');
const { RedditSubredditPage } = require('../page/redditSubredditPage.po.js');

const SUB = 'aww';

test.describe('Subreddit Join / Leave', () => {
  test('User can join and then leave a community', async ({ page }) => {
    const sub = new RedditSubredditPage(page);
    await sub.goto(SUB);

    // 🧹 Clean starting state — handles leftover state from previous runs.
    await sub.dismissCommunityGuide();
    if (await sub.isMember()) {
      await sub.leave();
    }

    await sub.join();
    expect(await sub.isMember()).toBeTruthy();

    await sub.leave();
    expect(await sub.isMember()).toBeFalsy();
  });
});