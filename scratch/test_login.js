const { firefox } = require('@playwright/test');

(async () => {
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to login page on Firefox...');
  await page.goto('https://merojob.com/jobseeker/login');
  await page.waitForLoadState('networkidle');

  console.log('Filling credentials...');
  await page.locator('input[name="email"]').fill('notarealuser12345@gmail.com');
  await page.locator('input[name="password"]').fill('WrongPassword!23');

  console.log('Clicking login...');
  await page.locator('button[type="submit"]').click();

  console.log('Waiting 5 seconds and checking...');
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(500);
    const hasError = await page.locator('text=Invalid email or password').count();
    const btnText = await page.locator('button[type="submit"]').innerText();
    const currentUrl = page.url();
    console.log(`[${i*0.5}s] Has error element: ${hasError}, Button text: "${btnText}", URL: ${currentUrl}`);
  }

  // Take screenshot
  await page.screenshot({ path: 'scratch/login_failed_firefox.png' });
  console.log('Screenshot saved to scratch/login_failed_firefox.png');

  await browser.close();
})();
