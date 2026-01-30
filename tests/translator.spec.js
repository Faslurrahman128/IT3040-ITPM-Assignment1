const { test, expect } = require('@playwright/test');

// Common selectors - we'll need to find these
const SELECTORS = {
  INPUT: 'textarea, input',
  OUTPUT: 'div, span, p',
  BUTTON: 'button'
};

test('Pos_Fun_0001 - Convert simple daily sentence', async ({ page }) => {
  // Try without waitForLoadState
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
  
  console.log('Page loaded, checking content...');
  
  // Wait a bit
  await page.waitForTimeout(3000);
  
  // Take screenshot to see what loaded
  await page.screenshot({ path: 'debug-page.png' });
  console.log('Screenshot saved as debug-page.png');
  
  // Try to find input field
  const inputs = await page.$$('textarea, input[type="text"]');
  console.log(`Found ${inputs.length} input elements`);
  
  if (inputs.length > 0) {
    // Type in first input
    await inputs[0].fill('naan veetuku poarean');
    await page.waitForTimeout(2000);
    
    // Look for output
    const allText = await page.textContent('body');
    console.log('Page content:', allText.substring(0, 500));
  }
});

// Simple test to check if website loads
test('Check website loads', async ({ page }) => {
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'commit',
    timeout: 30000 
  });
  
  const title = await page.title();
  console.log('Website title:', title);
  
  const url = page.url();
  console.log('Current URL:', url);
  
  // Check if page has content
  const bodyText = await page.textContent('body');
  console.log('Has content:', bodyText.length > 100);
});