// tests/themetoggle.spec.js
const { test, expect } = require('@playwright/test');
const { RedditNavigation } = require('../page/redditNavigation.po.js');

const getBg = (page) => page.evaluate(() => {
  const candidates = [
    document.documentElement,
    document.body,
    document.querySelector('shreddit-app'),
  ];
  for (const el of candidates) {
    if (!el) continue;
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
  }
  return null;
});

test.describe('Theme toggle', () => {
  test('Reddit responds to OS dark/light preference', async ({ page }) => {
    const nav = new RedditNavigation(page);
    await page.goto('https://www.reddit.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await nav.setTheme('dark');
    const darkBg = await getBg(page);

    await nav.setTheme('light');
    const lightBg = await getBg(page);

    expect(darkBg).not.toBe(lightBg);
  });
});