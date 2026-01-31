const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const page = await browser.newPage();
  
  console.log('Loading https://tamil.changathi.com...');
  
  try {
    await page.goto('https://tamil.changathi.com', { timeout: 60000 });
    await page.waitForTimeout(5000);
    
    console.log('✓ Website loaded');
    
    // Method 1: Find input by trying common selectors
    console.log('\n=== TRYING TO FIND INPUT ===');
    
    const selectorsToTry = [
      'input[type="text"]',
      'textarea',
      'input',
      '[contenteditable="true"]',
      '.form-control',
      '.input',
      '#input',
      '#text',
      '#textarea'
    ];
    
    for (const selector of selectorsToTry) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✓ Found with selector: "${selector}" (${count} elements)`);
        
        // Get details of first element
        const firstEl = page.locator(selector).first();
        const html = await firstEl.evaluate(el => el.outerHTML);
        console.log(`First element HTML: ${html.substring(0, 150)}`);
      }
    }
    
    // Method 2: Try to type something
    console.log('\n=== TYPING TEST ===');
    
    // Try the most common selectors
    const commonSelectors = ['textarea', 'input[type="text"]', 'input', '[contenteditable="true"]'];
    
    for (const selector of commonSelectors) {
      try {
        await page.locator(selector).first().fill('');
        await page.locator(selector).first().type('naan veetuku poarean');
        console.log(`✓ Typed using selector: "${selector}"`);
        break;
      } catch (error) {
        console.log(`✗ Failed with "${selector}": ${error.message}`);
      }
    }
    
    await page.waitForTimeout(3000);
    
    // Method 3: Look for Tamil output
    console.log('\n=== LOOKING FOR OUTPUT ===');
    
    const bodyText = await page.textContent('body');
    const hasTamil = bodyText.includes('நான்') || bodyText.includes('வீட்டு');
    
    if (hasTamil) {
      console.log('✓ Tamil text found in page!');
      
      // Find where Tamil text is
      const allElements = await page.locator('*:has-text("நான்"), *:has-text("வீட்டு")').all();
      console.log(`Found ${allElements.length} elements with Tamil text`);
      
      if (allElements.length > 0) {
        const element = allElements[0];
        const tag = await element.evaluate(el => el.tagName);
        const id = await element.getAttribute('id');
        const className = await element.getAttribute('class');
        const text = await element.textContent();
        
        console.log(`Output element: ${tag}`);
        console.log(`ID: ${id || 'none'}`);
        console.log(`Class: ${className || 'none'}`);
        console.log(`Text preview: ${text.substring(0, 100)}`);
      }
    } else {
      console.log('No Tamil text found.');
      console.log('Body text preview:', bodyText.substring(0, 500));
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-screenshot.png' });
    console.log('\n✓ Screenshot saved as debug-screenshot.png');
    
  } catch (error) {
    console.log('✗ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\nBrowser closed.');
  }
})();