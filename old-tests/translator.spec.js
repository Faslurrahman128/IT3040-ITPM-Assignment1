const { test, expect } = require('@playwright/test');

// Helper to type with spaces (CRITICAL - website needs space after each word)
async function typeWithSpaces(page, inputField, text) {
  await inputField.fill(''); // Clear first
  
  // Type word by word with SPACE after each
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    await inputField.type(words[i]);
    if (i < words.length - 1) {
      await inputField.press('Space');
      await page.waitForTimeout(200); // Wait for conversion
    }
  }
  await page.waitForTimeout(1000); // Final wait
}

// Find Tamil output on page
async function getTamilOutput(page) {
  // Tamil Unicode range
  const tamilRegex = /[\u0B80-\u0BFF]/;
  
  // Look for elements with Tamil text
  const allElements = await page.locator('*').all();
  for (const element of allElements.slice(0, 100)) { // Check first 100 elements
    try {
      const text = await element.textContent();
      if (text && tamilRegex.test(text)) {
        // Check if it's not just a single character
        const tamilChars = text.match(tamilRegex);
        if (tamilChars && tamilChars.length > 2) {
          return text.trim();
        }
      }
    } catch (e) {
      // Skip if error
    }
  }
  return '';
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
});

test('Pos_Fun_0001 - Convert simple daily sentence', async ({ page }) => {
  // Find input field
  const inputField = page.locator('textarea, input[type="text"]').first();
  await expect(inputField).toBeVisible();
  
  // Type WITH SPACES
  await typeWithSpaces(page, inputField, 'naan veetuku poarean');
  
  // Get Tamil output
  const output = await getTamilOutput(page);
  console.log('Tamil output found:', output);
  
  // Expected from your Excel
  const expected = 'நான் வீட்டுக்கு போறேன்';
  
  // Take screenshot
  await page.screenshot({ path: 'screenshots/Pos_Fun_0001.png', fullPage: true });
  
  // Assertion
  expect(output).toContain(expected);
});

test('Check website loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check page title/content
  const title = await page.title();
  expect(title).toBeTruthy();
  
  // Check if we can find input
  const inputField = page.locator('textarea, input[type="text"]').first();
  await expect(inputField).toBeVisible();
  
  console.log('Website loaded successfully');
});