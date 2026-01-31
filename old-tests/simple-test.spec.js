const { test, expect } = require('@playwright/test');

test('Check website', async ({ page }) => {
  await page.goto('https://tamil.changathi.com');
  await page.waitForTimeout(5000);
  console.log('Page loaded');
});