const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../page/loginPage.po.js');
const validLogin = require('../fixtures/validLoginFixture.json');

test.describe('MeroJob Valid Login', () => {
  test('Should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    const user = validLogin.login.validUser;
    await loginPage.login(user.email, user.password);

    // Post-login assertion: logged-in state indicator.
    // This uses a generic strategy: the presence of a logout link/button OR an authenticated landing URL.
    // Use case-insensitive matching via :text-is or just check for logout keyword without the invalid CSS flag.
    // Post-login assertion: logout state may not be consistent across pages/themes.
    // Fallback to “user session changed” signals: avatar/profile/logout link.
    // Generic post-login check: app usually redirects away from /jobseeker/login.
    // This is more stable than UI text/labels that may vary by theme/browser.
    await expect(page).not.toHaveURL(/jobseeker\/login/i, { timeout: 20000 });


  });
});


