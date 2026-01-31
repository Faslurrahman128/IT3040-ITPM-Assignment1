const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 300  // Slow down to see what's happening
  });
  
  const page = await browser.newPage();
  
  console.log('==============================================');
  console.log('DEBUGGING: https://tamil.changathi.com');
  console.log('==============================================\n');
  
  // Step 1: Go to website
  console.log('🌐 STEP 1: Loading website...');
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'networkidle',
    timeout: 60000 
  });
  await page.waitForTimeout(3000);
  
  console.log('✅ Website loaded\n');
  await page.screenshot({ path: 'debug-step1-loaded.png' });
  console.log('📸 Screenshot saved: debug-step1-loaded.png\n');
  
  // Step 2: Find input field
  console.log('🔍 STEP 2: Looking for input field...');
  
  const inputSelectors = [
    'textarea',
    'input[type="text"]',
    'input',
    '[contenteditable="true"]',
    '.form-control',
    '.input-field',
    '#inputText',
    '#english'
  ];
  
  let inputField = null;
  for (const selector of inputSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      inputField = page.locator(selector).first();
      console.log(`✓ Found input with selector: "${selector}"`);
      
      // Get element info
      const tagName = await inputField.evaluate(el => el.tagName);
      const id = await inputField.getAttribute('id');
      const placeholder = await inputField.getAttribute('placeholder');
      const value = await inputField.inputValue();
      
      console.log(`  Tag: ${tagName}`);
      console.log(`  ID: ${id || 'none'}`);
      console.log(`  Placeholder: "${placeholder || 'none'}"`);
      console.log(`  Current value: "${value || 'empty'}"\n`);
      break;
    }
  }
  
  if (!inputField) {
    console.log('❌ No input field found with common selectors!');
    console.log('Checking all interactive elements...\n');
    
    // List all interactive elements
    const allInputs = await page.locator('input, textarea, [contenteditable]').all();
    console.log(`Found ${allInputs.length} interactive elements total:`);
    
    for (let i = 0; i < Math.min(allInputs.length, 5); i++) {
      const element = allInputs[i];
      const tag = await element.evaluate(el => el.tagName);
      const id = await element.getAttribute('id');
      const type = await element.getAttribute('type');
      console.log(`  [${i+1}] ${tag}${id ? `#${id}` : ''}${type ? `[type="${type}"]` : ''}`);
    }
    
    await browser.close();
    return;
  }
  
  // Step 3: Type test text
  console.log('⌨️  STEP 3: Typing test text...');
  
  // Clear first
  await inputField.fill('');
  await page.waitForTimeout(500);
  
  console.log('Typing: "naan"');
  await inputField.type('naan');
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: 'debug-step3-typed-naan.png' });
  console.log('📸 Screenshot: debug-step3-typed-naan.png');
  
  // Check if Tamil appears immediately (without space)
  console.log('\n🔤 Checking for Tamil output (before space)...');
  let bodyText = await page.textContent('body');
  let hasTamilBeforeSpace = /[\u0B80-\u0BFF]/.test(bodyText);
  console.log(`Has Tamil before pressing space: ${hasTamilBeforeSpace ? 'YES' : 'NO'}`);
  
  // Step 4: Press SPACE
  console.log('\n🔘 STEP 4: Pressing SPACE key...');
  await inputField.press('Space');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'debug-step4-after-space.png' });
  console.log('📸 Screenshot: debug-step4-after-space.png');
  
  // Check if Tamil appears after space
  console.log('\n🔤 Checking for Tamil output (after space)...');
  bodyText = await page.textContent('body');
  let hasTamilAfterSpace = /[\u0B80-\u0BFF]/.test(bodyText);
  console.log(`Has Tamil after pressing space: ${hasTamilAfterSpace ? 'YES' : 'NO'}`);
  
  if (hasTamilAfterSpace) {
    // Find Tamil text
    const tamilMatches = bodyText.match(/[\u0B80-\u0BFF]+/g);
    console.log(`Found ${tamilMatches ? tamilMatches.length : 0} Tamil segments`);
    
    if (tamilMatches && tamilMatches.length > 0) {
      console.log('Tamil text found:');
      tamilMatches.forEach((text, i) => {
        console.log(`  [${i+1}] "${text}"`);
      });
      
      // Try to find which element contains Tamil
      console.log('\n🔍 Looking for Tamil container element...');
      const elementsWithTamil = await page.locator('*:has-text(/[\u0B80-\u0BFF]/)').all();
      console.log(`Found ${elementsWithTamil.length} elements with Tamil text`);
      
      if (elementsWithTamil.length > 0) {
        const element = elementsWithTamil[0];
        const tag = await element.evaluate(el => el.tagName);
        const id = await element.getAttribute('id');
        const className = await element.getAttribute('class');
        const text = await element.textContent();
        
        console.log('\n🎯 FIRST TAMIL ELEMENT:');
        console.log(`  Tag: ${tag}`);
        console.log(`  ID: ${id || 'none'}`);
        console.log(`  Class: ${className || 'none'}`);
        console.log(`  Text preview: ${text.substring(0, 100)}...`);
        
        // Generate selector
        let selector = tag.toLowerCase();
        if (id) selector = `#${id}`;
        else if (className) selector = `.${className.split(' ')[0]}`;
        
        console.log(`  Suggested selector: "${selector}"`);
      }
    }
  }
  
  // Step 5: Continue typing
  console.log('\n⌨️  STEP 5: Continuing to type...');
  console.log('Typing: "veetuku" + SPACE');
  await inputField.type('veetuku');
  await page.waitForTimeout(1000);
  await inputField.press('Space');
  await page.waitForTimeout(2000);
  
  console.log('Typing: "poarean"');
  await inputField.type('poarean');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'debug-step5-complete.png' });
  console.log('📸 Screenshot: debug-step5-complete.png');
  
  // Final check
  console.log('\n🔤 FINAL CHECK:');
  bodyText = await page.textContent('body');
  const hasFinalTamil = /[\u0B80-\u0BFF]/.test(bodyText);
  
  if (hasFinalTamil) {
    const tamilMatches = bodyText.match(/[\u0B80-\u0BFF]+/g);
    console.log(`🎉 SUCCESS! Found ${tamilMatches ? tamilMatches.length : 0} Tamil segments`);
    
    // Show all Tamil text
    const allTamil = tamilMatches ? tamilMatches.join(' ') : '';
    console.log(`Full Tamil output: "${allTamil}"`);
    
    // Check if it matches expected
    const expected = 'நான் வீட்டுக்கு போறேன்';
    console.log(`Expected: "${expected}"`);
    console.log(`Match found: ${allTamil.includes(expected) ? 'YES' : 'NO'}`);
  } else {
    console.log('❌ FAILED: No Tamil text found at all!');
    console.log('\n📝 Page text preview (first 500 chars):');
    console.log(bodyText.substring(0, 500));
  }
  
  // Keep browser open for manual inspection
  console.log('\n==============================================');
  console.log('MANUAL INSPECTION TIME');
  console.log('==============================================');
  console.log('Browser will stay open for 60 seconds...');
  console.log('Look at the browser and check:');
  console.log('1. Can you see Tamil text anywhere?');
  console.log('2. Where is it located?');
  console.log('3. Take a screenshot\n');
  
  await page.waitForTimeout(60000);
  
  await browser.close();
  console.log('\n✅ Debug complete!');
  console.log('\n📋 PLEASE TELL ME:');
  console.log('1. Did Tamil text appear? (YES/NO)');
  console.log('2. What was the output?');
  console.log('3. Where did it appear on the page?');
})();