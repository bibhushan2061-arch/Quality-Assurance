// page/redditPostPage.po.js
const { expect } = require('@playwright/test');

class RedditPostPage {
  constructor(page) {
    this.page = page;
    const postActions = page.locator('[aria-label="Actions available for this post"]');
    this.upvoteButton   = postActions.getByRole('button', { name: /upvote/i });
    this.downvoteButton = postActions.getByRole('button', { name: /downvote/i });
    
    // Playwright Best Practice: Target heading level 1 representing the post title
    this.postTitle = page.getByRole('heading', { level: 1 }).first();
    
    // Playwright Best Practice: Target the actual visible, interactive textbox trigger
    this.commentTrigger = page.getByPlaceholder('Join the conversation')
      .filter({ visible: true })
      .first();
    
    // Select the actual visible editor (slot="rte"), ignoring hidden drafts or reply templates
    this.commentEditor = page.locator('div[slot="rte"][contenteditable="true"]')
      .filter({ visible: true })
      .first();
    
    // Submit / Comment button locator
    this.commentSubmitButton = page.getByRole('button', { name: /^comment$/i })
      .or(page.locator('#comment-composer-submit-button'))
      .filter({ visible: true })
      .first();
  }

  async upvote() {
    await expect(this.upvoteButton).toBeVisible({ timeout: 15000 });
    await this.upvoteButton.click();
  }

  async downvote() {
    await expect(this.downvoteButton).toBeVisible({ timeout: 15000 });
    await this.downvoteButton.click();
  }

  /** Open the composer by clicking the collapsed trigger. */
  async openCommentComposer() {
    // 1. Wait for the page to reach network idle state to ensure JS event listeners (hydration) are attached
    await this.page.waitForLoadState('networkidle').catch(() => {});

    // 2. Wait for the trigger to be visible and stable
    await expect(this.commentTrigger).toBeVisible({ timeout: 15000 });
    
    // 3. Robust Click & Retry loop to handle hydration lag
    let expanded = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.commentTrigger.click();
      
      try {
        // Wait up to 3 seconds for the editor to appear to verify the click registered
        await expect(this.commentEditor).toBeVisible({ timeout: 3000 });
        expanded = true;
        break;
      } catch (e) {
        // Small delay before retrying
        await this.page.waitForTimeout(1000);
      }
    }

    if (!expanded) {
      // Final standard assertion to throw an informative timeout if it fails completely
      await expect(this.commentEditor).toBeVisible({ timeout: 10000 });
    }
  }

  /** Type into the (activated) editor. */
  async typeComment(text) {
    await this.commentEditor.focus();
    await this.commentEditor.fill(text);
  }

  /**
   * Real validation: opens the composer, leaves it empty,
   * and verifies the Comment button is disabled.
   */
  async verifyEmptyCommentDisablesSubmit() {
    await this.openCommentComposer();
    // Don't type anything
    await expect(this.commentSubmitButton).toBeVisible({ timeout: 10000 });
    await expect(this.commentSubmitButton).toBeDisabled();
  }

  /**
   * Verifies that typing real text enables the Comment button.
   */
  async verifyValidCommentEnablesSubmit(text = 'Test comment') {
    await this.openCommentComposer();
    await this.typeComment(text);
    await expect(this.commentSubmitButton).toBeEnabled({ timeout: 10000 });
  }
}

module.exports = { RedditPostPage };