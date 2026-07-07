// tests/forgotPasswordUI.spec.js
const { test, expect } = require('@playwright/test');
const { RedditForgotPasswordPage } = require('../page/redditForgotPasswordPage.po.js');

// Start as a guest — ignore saved auth state.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Forgot password UI', () => {
  test('Should open forgot password flow and show UI elements', async ({ page }) => {
    const forgot = new RedditForgotPasswordPage(page);

    await forgot.navigateToForgotPassword();

    await expect(forgot.emailInput).toBeVisible({ timeout: 15000 });
    await expect(forgot.submitButton).toBeAttached({ timeout: 15000 });
  });
});