const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.emailInput = '#email';
    this.passwordInput = 'input[placeholder="Password"]';
    this.loginButton = '#submit';
    this.logoutButton = '#logout';
    this.successMessage = 'text=Click on any contact to view the Contact Details';
    this.errorMessage = '#error';
  }

  // Navigate (good practice to keep it inside POM)
  async navigate() {
    await this.page.goto('/');
  }

  // Actions
  async login(email, password) {
    await this.page.locator(this.emailInput).fill(email);
    await this.page.locator(this.passwordInput).fill(password);
    await this.page.locator(this.loginButton).click();
  }

  async logout() {
    await this.page.locator(this.logoutButton).click();
  }

  async verifyValidLogin() {
    await expect(this.page.locator(this.successMessage)).toBeVisible();
    await expect(this.page.locator(this.logoutButton)).toBeVisible();
  }

  async verifyInvalidLogin() {
    const InvalidLogin = await this.page.locator(this.alertMessage);
    await expect(this.page.locator(this.errorMessage)).toBeVisible();
    await expect(this.page.locator(this.errorMessage))
      .toHaveText('Incorrect username or password');

    await expect(this.page.locator(this.logoutButton)).not.toBeVisible();
  }

  async verifyEmptyLogin(){
    const InvalidLogin = await this.page.locator(this.alertMessage);
    await expect(this.page.locator(this.errorMessage)).toBeVisible();
    await expect(this.page.locator(this.errorMessage))
      .toHaveText('Incorrect username or password');

    await expect(this.page.locator(this.logoutButton)).not.toBeVisible();
  }

};