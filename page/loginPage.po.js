// page/loginPage.po.js
const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;

    this.usernameInput = page.locator('input[name="username"]').first();
    this.passwordInput = page.locator('input[name="password"]').first();

    this.loginBtn = page.getByRole('button', { name: /^log in$/i });

    // Covers all inline + post-submit error variants Reddit shows.
    this.loginError = page.getByText(
      /invalid (email|username) or password|incorrect username or password|try again/i
    );

    this.userMenuBtn = page.getByRole('button', { name: /expand user menu/i });
  }

  async navigate() {
    await this.page.goto('https://www.reddit.com/login', { waitUntil: 'domcontentloaded' });
    await expect(this.usernameInput).toBeVisible({ timeout: 20000 });
  }

  /** Returns 'success' | 'error' | 'disabled'. */
  async login(username, password) {
    if (username) await this.usernameInput.fill(username);
    if (password) await this.passwordInput.fill(password);

    // Reddit performs client-side validation. If the input is invalid (empty OR badly formatted),
    // the submit button stays disabled — that IS the validation signal.
    if (await this.loginBtn.isDisabled()) return 'disabled';

    await this.loginBtn.click();

    return await Promise.race([
      this.page.waitForURL(u => !u.toString().includes('/login'), { timeout: 15000 })
        .then(() => 'success'),
      this.loginError.first().waitFor({ state: 'visible', timeout: 15000 })
        .then(() => 'error'),
    ]).catch(() => { throw new Error('Login did not resolve.'); });
  }

  async verifyLoggedIn()              { await expect(this.userMenuBtn).toBeVisible({ timeout: 20000 }); }
  async verifyErrorIsVisible()        { await expect(this.loginError.first()).toBeVisible({ timeout: 20000 }); }
  async verifyFieldValidationError()  { await expect(this.loginBtn).toBeDisabled(); }
};