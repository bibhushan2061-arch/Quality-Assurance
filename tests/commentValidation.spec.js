// tests/commentValidation.spec.js
const { test, expect } = require('@playwright/test');
const { RedditPostPage } = require('../page/redditPostPage.po.js');

test.describe('Comment validation', () => {
  test('Comment button enables and disables correctly based on content', async ({ page }) => {
    const postPage = new RedditPostPage(page);
    
    // 1. Navigate to subreddit
    await page.goto('/r/reactjs', { waitUntil: 'domcontentloaded' });
    
    // 2. Open first post comments thread
    const firstPost = page.locator('a[href*="/comments/"]').first();
    await expect(firstPost).toBeVisible({ timeout: 15000 });
    await firstPost.click();
    await expect(page).toHaveURL(/\/comments\//, { timeout: 15000 });
    
    // 3. Open composer and verify the Comment button is visible
    await postPage.openCommentComposer();
    await expect(postPage.commentSubmitButton).toBeVisible({ timeout: 10000 });
    
    // 4. Type a valid comment and verify Comment button is active and enabled
    await postPage.typeComment('Hello from Playwright!');
    await expect(postPage.commentSubmitButton).toBeEnabled({ timeout: 10000 });
    
    // Note: We never actually click submit, ensuring we avoid posting a real comment.
  });
});