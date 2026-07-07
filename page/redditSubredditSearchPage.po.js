// page/redditSubredditSearchPage.po.js
const { expect } = require('@playwright/test');

class RedditSubredditSearchPage {
  constructor(page) {
    this.page = page;
    this.firstSubredditResult = page.locator('a[href^="/r/"]').first();
  }

  async searchSubreddit(query) {
    await this.page.goto(
      `https://www.reddit.com/search/?q=${encodeURIComponent(query)}&type=sr`,
      { waitUntil: 'domcontentloaded', timeout: 60000 }
    );
    await expect(this.firstSubredditResult).toBeVisible({ timeout: 15000 });
  }

  // ⬅️ Keeps the original name your tests use
  async pickFirstSubredditFromResults() {
    await this.firstSubredditResult.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { RedditSubredditSearchPage };