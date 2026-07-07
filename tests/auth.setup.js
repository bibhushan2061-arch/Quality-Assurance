import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  await page.goto('https://www.reddit.com/login', { waitUntil: 'domcontentloaded' });

  const username = page.locator('input[name="username"]');
  const password = page.locator('input[type="password"]');

  await expect(username).toBeVisible({ timeout: 15000 });

  await username.fill(process.env.REDDIT_USER);
  await password.fill(process.env.REDDIT_PASS);

  await page.getByRole('button', { name: /log in/i }).click();

  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 30000 });

  await page.context().storageState({ path: authFile });
  console.log('Auth session saved to', authFile);
});
