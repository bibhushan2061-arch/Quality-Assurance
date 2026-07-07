// tests/loginValidation.spec.js
const { test } = require('@playwright/test');
const { LoginPage } = require('../page/loginPage.po.js');
const testData = require('../fixtures/loginFixture.json');

// Force a clean (logged-out) browser context for this file.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Reddit Login Page Validations', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Should show error with invalid credentials', async () => {
    const u = testData.login.invalidUser;
    await loginPage.login(u.username ?? u.email ?? '', u.password ?? '');
    await loginPage.verifyErrorIsVisible();
  });

  test('Should show validation error when submitting empty fields', async () => {
    const u = testData.login.emptyUser;
    await loginPage.login(u.username ?? u.email ?? '', u.password ?? '');
    await loginPage.verifyFieldValidationError(); // button is disabled
  });

  test('Should show validation error for badly formatted input', async () => {
    const u = testData.login.badFormatUser;
    await loginPage.login(u.username ?? u.email ?? '', u.password ?? '');
    // Bad format may either keep the button disabled OR trigger an error — handle both:
    await Promise.race([
      loginPage.verifyFieldValidationError(),
      loginPage.verifyErrorIsVisible(),
    ]);
  });
});