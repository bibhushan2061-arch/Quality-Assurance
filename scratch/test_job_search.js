const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to MeroJob search page directly...');
  await page.goto('https://merojob.com/search?q=QA');
  await page.waitForLoadState('networkidle');

  console.log('Waiting 10 seconds for results to load and skeleton placeholders to disappear...');
  await page.waitForTimeout(10000);

  // Take screenshot
  await page.screenshot({ path: 'scratch/search_after_10s.png' });
  console.log('Saved screenshot search_after_10s.png');

  // Let's print all links on the page containing "vacancy" or with typical job result structures
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href')
    })).filter(l => l.href && (l.href.includes('vacancy') || l.href.includes('job') || l.text.length > 5));
  });

  console.log(`Found ${links.length} potential links:`);
  links.slice(0, 40).forEach((l, i) => {
    console.log(`Link ${i}: [${l.text}] -> ${l.href}`);
  });

  await browser.close();
})();
