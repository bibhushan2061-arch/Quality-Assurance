const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../page/loginPage.po.js');
const validLogin = require('../fixtures/validLoginFixture.json');

// Ignore the saved auth state — start as a guest.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Reddit Valid Login', () => {
  test('Should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    const user = validLogin.login.validUser;
    await loginPage.login(user.username ?? user.email ?? '', user.password ?? '');

    await loginPage.verifyLoggedIn();
  });
});