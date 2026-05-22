const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;

    // Locators
    this.searchInput = 'form input[type="text"]';
    this.searchButton = 'form button[type="submit"]';
    this.loginLink = 'a[href*="jobseeker/login"]';
    this.registerLink = 'a[href*="jobseeker/register"]';
  }

  // Navigate to Homepage
  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  // Perform Job Search
  async searchJob(keyword) {
    await this.page.locator(this.searchInput).first().fill(keyword);
    await this.page.locator(this.searchButton).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  // Click Login button to navigate to Login page
  async clickLogin() {
    await this.page.locator(this.loginLink).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  // Click Register button to navigate to Registration page
  async clickRegister() {
    await this.page.locator(this.registerLink).first().click();
    await this.page.waitForLoadState('networkidle');
  }
};
