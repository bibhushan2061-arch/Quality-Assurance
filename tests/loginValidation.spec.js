const { test } = require('@playwright/test');
const { LoginPage } = require('../page/loginPage.po.js');
const testData = require('../fixtures/jobSearchFixture.json');

test.describe('MeroJob Login Page Validations', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Should show error with invalid credentials combination', async () => {
    const user = testData.login.invalidUser;
    await loginPage.login(user.email, user.password);
    // MeroJob shows a toast or error text on failed logins
    await loginPage.verifyErrorIsVisible('Invalid email or password');
  });

  test('Should show validation states when submitting empty login fields', async () => {
    const user = testData.login.emptyUser;
    await loginPage.login(user.email, user.password);
    await loginPage.verifyFieldValidationError();
  });

  test('Should validate badly formatted email input', async () => {
    const user = testData.login.badFormatUser;
    await loginPage.login(user.email, user.password);
    await loginPage.verifyFieldValidationError();
  });
});
