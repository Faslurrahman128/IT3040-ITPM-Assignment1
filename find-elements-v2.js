const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false, // Keep browser visible
    slowMo: 500, // Slow down so you can see what's happening
    args: ['--disable-blink-features=AutomationControlled']
  });
  
  const page = await browser.newPage();
  
  console.log('Loading https://tamil.changathi.com...');
  
  try {
    await page.goto('https://tamil.changathi.com', { timeout: 60000 });
    console.log('✓ Website loaded');
    
    // Wait longer
    await page.waitForTimeout(5000);
    
    // Take screenshot immediately
    await page.screenshot({ path: 'step1-loaded.png' });
    console.log('✓ Screenshot 1 saved: step1-loaded.png');
    
    // STEP 1: Look for input field
    console.log('\n=== STEP 1: Looking for input field ===');
    
    // Try to click where people would type
    await page.mouse.click(400, 300); // Click middle of page
    await page.waitForTimeout(1000);
    
    // Try typing
    await page.keyboard.type('naan veetuku poarean');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'step2-typed.png' });
    console.log('✓ Screenshot 2 saved: step2-typed.png');
    
    // STEP 2: Look for Tamil text
    console.log('\n=== STEP 2: Looking for Tamil output ===');
    
    const pageText = await page.content();
    if (pageText.includes('நான்') || pageText.includes('வீட்டு')) {
      console.log('✓ SUCCESS! Found Tamil text on page!');
      
      // Find the element containing Tamil text
      const tamilElement = await page.locator('*:has-text("நான்"), *:has-text("வீட்டு")').first();
      const elementInfo = await tamilElement.evaluate(el => ({
        tag: el.tagName,
        id: el.id,
        className: el.className,
        html: el.outerHTML.substring(0, 200)
      }));
      
      console.log('\n=== OUTPUT ELEMENT INFO ===');
      console.log('Tag:', elementInfo.tag);
      console.log('ID:', elementInfo.id || 'none');
      console.log('Class:', elementInfo.className || 'none');
      console.log('HTML preview:', elementInfo.html);
    } else {
      console.log('✗ No Tamil text found.');
      console.log('Page content preview:', pageText.substring(0, 1000));
    }
    
    // STEP 3: Keep browser open for manual inspection
    console.log('\n=== BROWSER WILL STAY OPEN ===');
    console.log('You can now:');
    console.log('1. Press F12 to open DevTools');
    console.log('2. Inspect elements');
    console.log('3. Look for input/output fields');
    console.log('4. Press Enter here when done...');
    
    // Wait for user to press Enter
    await new Promise(resolve => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('Press Enter to close browser...', () => {
        readline.close();
        resolve();
      });
    });
    
  } catch (error) {
    console.log('✗ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\nBrowser closed.');
  }
})();