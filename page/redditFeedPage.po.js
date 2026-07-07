// page/redditFeedPage.po.js
const { expect } = require('@playwright/test');

class RedditFeedPage {
  constructor(page) {
    this.page = page;
    this.sortButton = page.getByRole('button', { name: /^sort by:/i }).first();
    this.firstPost  = page.getByRole('article').first();
  }

  async goto() {
    await this.page.goto('https://www.reddit.com/r/popular/', { waitUntil: 'domcontentloaded' });
    await expect(this.firstPost).toBeVisible({ timeout: 15000 });
  }

  async sortBy(option) {
    const sort = option.toLowerCase();
    await this.page.goto(`https://www.reddit.com/r/popular/${sort}/`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(this.sortButton).toHaveAccessibleName(
      new RegExp(`sort by: ${option}`, 'i'),
      { timeout: 10000 }
    );
  }

  async getCurrentSort() {
    const name = (await this.sortButton.getAttribute('aria-label'))
      ?? (await this.sortButton.textContent());
    return name?.replace(/^sort by:\s*/i, '').trim();
  }

  async getFirstPostTitle() {
    await expect(this.firstPost).toBeVisible({ timeout: 15000 });
    return (await this.firstPost.getAttribute('aria-label'))?.trim();
  }
}

module.exports = { RedditFeedPage };