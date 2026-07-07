// page/redditNavigation.po.js
const { expect } = require('@playwright/test');

class RedditNavigation {
  constructor(page) {
    this.page = page;
    this.menuButton  = page.getByRole('button', { name: /expand user menu/i });
    this.loginButton = page.getByRole('link',   { name: /^log in$/i })
      .or(page.getByRole('button', { name: /^log in$/i }));
  }

  async openAccountMenu() {
    await this.menuButton.click();
    await expect(this.menuButton).toHaveAttribute('aria-expanded', 'true');
  }

  async logout() {
    await this.page.context().clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await expect(this.loginButton).toBeVisible();
  }

  /** Emulates the OS color-scheme preference. Works for any site. */
  async setTheme(mode /* 'dark' | 'light' */) {
    await this.page.emulateMedia({ colorScheme: mode });
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  /** Reads the effective color scheme the browser is reporting. */
  async getCurrentTheme() {
    return this.page.evaluate(() =>
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );
  }
}

module.exports = { RedditNavigation };