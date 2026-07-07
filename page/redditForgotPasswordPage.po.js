// page/redditForgotPasswordPage.po.js
const { expect } = require('@playwright/test');

class RedditForgotPasswordPage {
  constructor(page) {
    this.page = page;

    this.forgotPasswordLink = page.locator('a[href*="password"]').first();

    // Target directly — no dialog scope needed, only one textbox on this page
    this.emailInput = page.getByRole('textbox').first();

    // Target directly — button is outside dialog scope anyway
    this.submitButton = page.getByRole('button', { name: /reset password/i });

    this.error = page.locator('[role="alert"], .error').first();
  }

  async navigateToForgotPassword() {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });

    await expect(this.forgotPasswordLink).toBeVisible({ timeout: 15000 });
    await this.forgotPasswordLink.click();

    // Wait for the heading to confirm the reset form has loaded
    await expect(
      this.page.getByRole('heading', { name: /reset your password/i })
    ).toBeVisible({ timeout: 15000 });
  }

  async submitEmail(email) {
    await expect(this.emailInput).toBeVisible({ timeout: 15000 });
    await this.emailInput.fill(email);

    await expect(this.submitButton).toBeEnabled({ timeout: 15000 });
    await this.submitButton.click();
  }

  async verifyErrorVisible() {
    await expect(this.error).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { RedditForgotPasswordPage };