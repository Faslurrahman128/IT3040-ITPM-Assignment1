const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000  // Very slow so you can see everything
  });
  
  const page = await browser.newPage();
  
  console.log('==============================================');
  console.log('MANUAL INSPECTION OF tamil.changathi.com');
  console.log('==============================================\n');
  
  console.log('Opening website...');
  await page.goto('https://tamil.changathi.com/');
  
  console.log('\n✅ Website loaded!');
  console.log('\n=== YOUR TASK ===');
  console.log('1. Look at the browser window');
  console.log('2. Find where you would type Thanglish text');
  console.log('3. MANUALLY TYPE this in that field: "naan veetuku poarean"');
  console.log('4. See where Tamil output appears');
  console.log('5. Right-click on the INPUT field → Inspect');
  console.log('6. Right-click on the highlighted HTML → Copy → Copy selector');
  console.log('7. Do the same for OUTPUT area');
  console.log('8. Check if there is a "Translate" button');
  console.log('\nI will keep browser open for 5 minutes...');
  
  // Keep browser open for manual inspection
  await page.waitForTimeout(300000); // 5 minutes
  
  await browser.close();
  console.log('\n✅ Browser closed. Please tell me:');
  console.log('1. Input selector (e.g., "#inputField", "textarea", etc.):');
  console.log('2. Output selector:');
  console.log('3. Button selector (if any):');
})();