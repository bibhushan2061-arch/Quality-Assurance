import { test,except } from '@playwright/test';

test('Login with valid credentials', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');//navigate
    
    await page.locator('input[name="username"]').fill('student');
    await page.locator('input[name="password"]').fill('Password123');
    await page.locator('text=Login').click;
    await page.waitForSelector('text=Logged in successfully');
  });

test('Login with invalid credentials', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');//navigate 
    await page.locator('input[name="username"]').fill('invalidUser@example.com');
    await page.locator('input[name="password"]').fill('invalidPassword');
    await page.locator('text=Login').click;
    await page.waitForSelector('text=Invalid credentials');
  }); 


