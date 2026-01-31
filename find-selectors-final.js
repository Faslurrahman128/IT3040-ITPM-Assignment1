const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const page = await browser.newPage();
  
  console.log('🚀 Opening https://tamil.changathi.com...');
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'networkidle',
    timeout: 60000 
  });
  
  console.log('✅ Website loaded\n');
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'website-loaded.png' });
  console.log('📸 Screenshot saved: website-loaded.png\n');
  
  console.log('🔍 ===== STEP 1: FINDING INPUT FIELD =====');
  
  // Common input selectors
  const inputSelectors = [
    'textarea',
    'input[type="text"]',
    'input',
    '[contenteditable="true"]',
    '#input',
    '#text',
    '#source'
  ];
  
  for (const selector of inputSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`✓ Found with selector: "${selector}" (${count} elements)`);
      const element = page.locator(selector).first();
      
      // Get element details
      const tagName = await element.evaluate(el => el.tagName);
      const id = await element.getAttribute('id');
      const placeholder = await element.getAttribute('placeholder');
      
      console.log(`  Tag: ${tagName}`);
      console.log(`  ID: ${id || 'none'}`);
      console.log(`  Placeholder: "${placeholder || 'none'}"`);
      
      // Try typing
      await element.click();
      await element.fill('vanakkam');
      await page.waitForTimeout(1000);
      console.log(`  Typed: "vanakkam"\n`);
      break;
    }
  }
  
  console.log('🔍 ===== STEP 2: FINDING BUTTON =====');
  
  // Look for any button
  const buttonCount = await page.locator('button').count();
  console.log(`Found ${buttonCount} button(s) on page`);
  
  if (buttonCount > 0) {
    const buttons = await page.locator('button').all();
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      console.log(`  Button ${i+1}: "${text?.trim()}"`);
    }
    
    // Try clicking first button
    await buttons[0].click();
    await page.waitForTimeout(2000);
    console.log('Clicked first button');
  }
  
  console.log('🔍 ===== STEP 3: LOOKING FOR TAMIL OUTPUT =====');
  
  // Check page content for Tamil text
  const bodyText = await page.textContent('body');
  const hasTamil = /[\u0B80-\u0BFF]/.test(bodyText);
  
  if (hasTamil) {
    console.log('✅ Found Tamil text on page!');
    
    // Find which element contains Tamil
    const allElements = await page.locator('*').all();
    for (const element of allElements.slice(0, 50)) { // Check first 50 elements
      try {
        const text = await element.textContent();
        if (text && /[\u0B80-\u0BFF]/.test(text)) {
          const tag = await element.evaluate(el => el.tagName);
          const id = await element.getAttribute('id');
          console.log(`  Tamil found in: ${tag}${id ? `#${id}` : ''}`);
          console.log(`  Text: ${text.substring(0, 100)}...`);
          break;
        }
      } catch (e) {
        // Some elements might not have textContent
      }
    }
  } else {
    console.log('❌ No Tamil text found');
  }
  
  // Final screenshot
  await page.screenshot({ path: 'after-typing.png' });
  console.log('\n📸 Final screenshot: after-typing.png');
  
  console.log('\n🕒 Keeping browser open for 30 seconds for manual inspection...');
  console.log('👉 Right-click on input field → Inspect → Copy selector');
  await page.waitForTimeout(30000);
  
  await browser.close();
  console.log('\n✅ Done! Please tell me:');
  console.log('1. Input field selector:');
  console.log('2. Output area selector:');
  console.log('3. Button selector (if any):');
})();