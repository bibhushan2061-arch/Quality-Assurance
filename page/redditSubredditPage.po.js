// page/redditSubredditPage.po.js
const { expect } = require('@playwright/test');

class RedditSubredditPage {
  constructor(page) {
    this.page = page;

    this.subredditHeader = page.locator('a[href^="/r/"]').first();
    this.firstPostLink   = page.locator('a[href*="/comments/"]').first();
    this.commentSection  = page.locator('[data-testid="comment-tree"], shreddit-comment-tree');

    // Join / Leave
    this.joinButton   = page.getByRole('button', { name: /^join$/i }).first();
    this.joinedButton = page.getByRole('button', { name: /^joined$|^member$|^subscribed$/i }).first();
    this.leaveConfirm = page.getByRole('button', { name: /^leave$/i });

    // Overlay after first join
    this.communityGuideGotIt = page.getByRole('button', { name: /^got it$/i });
  }

  async goto(name) {
    await this.page.goto(`https://www.reddit.com/r/${name}/`, {
      waitUntil: 'domcontentloaded',
    });
    await this.verifySubredditLoaded();
  }

  async verifySubredditLoaded() {
    await expect(this.subredditHeader).toBeVisible({ timeout: 20000 });
    await expect(this.firstPostLink).toBeVisible({ timeout: 20000 });
  }

  async openFirstPost() {
    await expect(this.firstPostLink).toBeVisible({ timeout: 15000 });
    const href = await this.firstPostLink.getAttribute('href');
    if (!href) throw new Error('No post link found');
    await this.page.goto(
      new URL(href, 'https://www.reddit.com').toString(),
      { waitUntil: 'domcontentloaded' }
    );
    await expect(this.commentSection.first()).toBeVisible({ timeout: 20000 });
  }

  async dismissCommunityGuide() {
    if (await this.communityGuideGotIt.isVisible().catch(() => false)) {
      await this.communityGuideGotIt.click();
      await expect(this.communityGuideGotIt).toBeHidden({ timeout: 5000 });
    }
  }

  async isMember() {
    return this.joinedButton.isVisible().catch(() => false);
  }

  async join() {
    await expect(this.joinButton).toBeVisible({ timeout: 10000 });
    await this.joinButton.click();
    await expect(this.joinedButton).toBeVisible({ timeout: 10000 });
    await this.dismissCommunityGuide();
  }

  async leave() {
    await this.dismissCommunityGuide();
    await expect(this.joinedButton).toBeVisible({ timeout: 10000 });

    // Retry the hover+click in case the community-guide dialog reappears mid-action.
    await expect(async () => {
      await this.dismissCommunityGuide();
      await this.joinedButton.hover();
      await this.joinedButton.click({ timeout: 5000 });
    }).toPass({ timeout: 15000 });

    if (await this.leaveConfirm.isVisible().catch(() => false)) {
      await this.leaveConfirm.click();
    }
    await expect(this.joinButton).toBeVisible({ timeout: 10000 });
  }
}

module.exports = { RedditSubredditPage };