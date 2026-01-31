const { test, expect } = require('@playwright/test');
const fs = require('fs');

// ========== CONFIGURATION ==========
const SCREENSHOTS_DIR = 'screenshots';
const TEST_TIMEOUT = 15000; // 15 seconds per test

// Create screenshots directory if it doesn't exist
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// ========== HELPER FUNCTIONS ==========

// Optimized typing function
async function typeText(page, inputField, text) {
  await inputField.fill('');
  await inputField.type(text);
  await inputField.press('Space');
  await page.waitForTimeout(800); // Reduced wait time
}

// Check if text contains Tamil
function containsTamil(text) {
  const tamilRegex = /[\u0B80-\u0BFF]/;
  return tamilRegex && tamilRegex.test(text);
}

// Get Tamil text from page
async function getTamilText(page) {
  // First try to get from input field
  const inputField = page.locator('textarea, input[type="text"]').first();
  const inputValue = await inputField.inputValue();
  
  if (containsTamil(inputValue)) {
    return inputValue;
  }
  
  // Look for Tamil text in the page
  const pageContent = await page.content();
  const tamilRegex = /[\u0B80-\u0BFF][\u0B80-\u0BFF\s.,?!]*[\u0B80-\u0BFF]/g;
  const matches = pageContent.match(tamilRegex);
  
  if (matches && matches.length > 0) {
    return matches[0];
  }
  
  return '';
}

// ========== SETUP ==========

test.beforeEach(async ({ page }) => {
  await page.goto('https://tamil.changathi.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Reduced wait time
});

test.afterEach(async ({ page }, testInfo) => {
  // Take screenshot only if test failed
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ 
      path: `${SCREENSHOTS_DIR}/${testInfo.title.replace(/[^a-z0-9]/gi, '_')}.png` 
    });
  }
});

// ========== POSITIVE TESTS (24 tests - Should PASS) ==========

const positiveTests = [
  { id: 'Pos_Fun_0001', input: 'naan veetuku poarean', expectedContains: ['நான்', 'வீட்டுக்கு'] },
  { id: 'Pos_Fun_0002', input: 'nee eppo varuva?', expectedContains: ['நீ', 'எப்போ'] },
  { id: 'Pos_Fun_0003', input: 'Konjam help pannuviya ?', expectedContains: ['கொஞ்சம்', 'ஹெல்ப்'] },
  { id: 'Pos_Fun_0004', input: 'machan innaiku semma day da', expectedContains: ['மச்சான்', 'இன்னைக்கு'] },
  { id: 'Pos_Fun_0005', input: 'naan ippo padikirean', expectedContains: ['நான்', 'இப்போ'] },
  { id: 'Pos_Fun_0006', input: 'naan neatru office ku poanean', expectedContains: ['நான்', 'நேற்று'] },
  { id: 'Pos_Fun_0007', input: 'naan nalaiku vaanguvean', expectedContains: ['நான்', 'நாளைக்கு'] },
  { id: 'Pos_Fun_0008', input: 'naan adha panna mattean', expectedContains: ['நான்', 'அதை'] },
  { id: 'Pos_Fun_0009', input: 'enkku romba pasikuthu', expectedContains: ['எனக்கு', 'பசிக்குது'] },
  { id: 'Pos_Fun_0010', input: 'naan veetuku poanean', expectedContains: ['நான்', 'வீட்டுக்கு'] },
  { id: 'Pos_Fun_0011', input: 'nee vanthaal naan solluran', expectedContains: ['நீ', 'வந்தால்'] },
  { id: 'Pos_Fun_0012', input: 'indaiku zoom meeting iruku', expectedContains: ['இன்னைக்கு', 'ஜூம்'] },
  { id: 'Pos_Fun_0013', input: 'whatsapp le message pannu', expectedContains: ['வாட்ஸாப்ப்', 'மெசேஜ்'] },
  { id: 'Pos_Fun_0014', input: 'meeting 7.30 ku start aagum', expectedContains: ['மீட்டிங்', 'ஸ்டார்ட்'] },
  { id: 'Pos_Fun_0015', input: 'exam 28 / 01 / 2026 nadakum', expectedContains: ['எக்ஸாம்', 'நடக்கும்'] },
  { id: 'Pos_Fun_0016', input: 'intha book oada price rs.1500', expectedContains: ['இந்த', 'புக்'] },
  { id: 'Pos_Fun_0017', input: 'enga teachers ellarum varuvange', expectedContains: ['எங்க', 'டீச்சர்ஸ்'] },
  { id: 'Pos_Fun_0018', input: 'avanga nalaiku trip poapuraange', expectedContains: ['அவங்க', 'நாளைக்கு'] },
  { id: 'Pos_Fun_0019', input: 'seekiram seekiram vaa', expectedContains: ['சீக்கிரம்', 'வா'] },
  { id: 'Pos_Fun_0020', input: 'naan kandy ku travel pandren', expectedContains: ['நான்', 'கண்டி'] },
  { id: 'Pos_Fun_0021', input: 'vanakam eppadi irukeenga', expectedContains: ['வணக்கம்', 'எப்படி'] },
  { id: 'Pos_Fun_0022', input: 'innaiku enakku office le romba vealai irunthichu', expectedContains: ['இன்னைக்கு', 'ஆபீஸ்'] },
  { id: 'Pos_Fun_0023', input: 'please door a close pannunge', expectedContains: ['ப்ளீஸ்', 'டூர்'] },
  { id: 'Pos_Fun_0024', input: 'naan ippoathu veetula irukkan', expectedContains: ['நான்', 'இப்போது'] },
];

// Generate 24 positive tests
for (let i = 0; i < positiveTests.length; i++) {
  const { id, input, expectedContains } = positiveTests[i];
  
  test(`${id} - ${input.substring(0, 20)}...`, async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);
    
    console.log(`Running ${id}: "${input}"`);
    
    // Find input field
    const inputField = page.locator('textarea, input[type="text"]').first();
    await expect(inputField).toBeVisible({ timeout: 5000 });
    
    // Type the text
    await typeText(page, inputField, input);
    
    // Get Tamil output
    const tamilOutput = await getTamilText(page);
    
    console.log(`Output: "${tamilOutput.substring(0, 50)}..."`);
    
    // Check if it contains Tamil
    expect(containsTamil(tamilOutput), `Should contain Tamil characters`).toBe(true);
    
    // Check if it contains expected Tamil words
    for (const expectedWord of expectedContains) {
      expect(tamilOutput).toContain(expectedWord);
    }
    
    console.log(`✅ ${id} PASSED`);
  });
}

// ========== NEGATIVE TESTS (10 tests - Should FAIL) ==========

const negativeTests = [
  { id: 'Neg_Fun_0001', input: 'anga ponalum oru use um ille', description: 'English word semantic failure' },
  { id: 'Neg_Fun_0002', input: 'naanum thaan kooda poana', description: 'Incorrect Thanglish spelling' },
  { id: 'Neg_Fun_0003', input: 'enekku nic veanum', description: 'English abbreviation' },
  { id: 'Neg_Fun_0004', input: 'naan 2nd day college poahala', description: 'Numbers replacing letters' },
  { id: 'Neg_Fun_0005', input: 'meeting cancel aahiduchu pls inform', description: 'English shorthand' },
  { id: 'Neg_Fun_0006', input: 'avan kai kalandhu pesuran', description: 'Idiomatic expression' },
  { id: 'Neg_Fun_0007', input: 'intha idea work aagathu', description: 'Untranslated English verb' },
  { id: 'Neg_Fun_0008', input: 'intha movie boring aa iruku', description: 'English adjective' },
  { id: 'Neg_Fun_0009', input: 'naan totally confuse aagitten', description: 'English adverb' },
  { id: 'Neg_Fun_0010', input: 'avan enna ignore pannitan', description: 'English verb phrase' },
];

// Generate 10 negative tests
for (let i = 0; i < negativeTests.length; i++) {
  const { id, input, description } = negativeTests[i];
  
  test(`${id} - ${description}`, async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT);
    
    console.log(`\nRunning ${id}: "${input}"`);
    console.log(`Description: ${description}`);
    
    // Find input field
    const inputField = page.locator('textarea, input[type="text"]').first();
    await expect(inputField).toBeVisible({ timeout: 5000 });
    
    // Type the text
    await typeText(page, inputField, input);
    
    // Get Tamil output
    const tamilOutput = await getTamilText(page);
    
    console.log(`Output: "${tamilOutput}"`);
    
    if (tamilOutput) {
      // For negative tests, we expect either:
      // 1. No Tamil output, OR
      // 2. Output contains English words (incorrect conversion)
      const hasEnglish = /[a-zA-Z]/.test(tamilOutput);
      
      if (containsTamil(tamilOutput) && !hasEnglish) {
        // If it has Tamil and no English, the website converted it properly
        // This is UNEXPECTED for negative tests
        console.log(`❌ ${id}: Website converted correctly (unexpected)`);
        throw new Error(`Negative test ${id} should have failed conversion but succeeded`);
      } else {
        console.log(`✅ ${id}: Website failed to convert properly (expected)`);
        expect(true).toBe(true); // Test passes
      }
    } else {
      // No output is also acceptable for negative tests
      console.log(`✅ ${id}: No output (acceptable for negative test)`);
      expect(true).toBe(true);
    }
  });
}

// ========== UI TEST (1 test - Should FAIL) ==========

test('Neg_UI_0001 - System lacks real-time translation feature', async ({ page }) => {
  test.setTimeout(TEST_TIMEOUT);
  
  console.log('\n=== Testing real-time translation ===');
  
  // Find input field
  const inputField = page.locator('textarea, input[type="text"]').first();
  await expect(inputField).toBeVisible({ timeout: 5000 });
  
  // Clear field
  await inputField.fill('');
  
  // Test 1: Type without space (should NOT convert)
  await inputField.type('v');
  await page.waitForTimeout(500);
  
  const output1 = await inputField.inputValue();
  const hasTamilWhileTyping = containsTamil(output1);
  console.log(`After typing 'v': "${output1}" - Has Tamil: ${hasTamilWhileTyping}`);
  
  // Test 2: Type more without space
  await inputField.type('a');
  await page.waitForTimeout(500);
  
  const output2 = await inputField.inputValue();
  const hasTamilAfterVA = containsTamil(output2);
  console.log(`After typing 'va': "${output2}" - Has Tamil: ${hasTamilAfterVA}`);
  
  // Test 3: Type space (should convert)
  await inputField.press('Space');
  await page.waitForTimeout(1000);
  
  const output3 = await inputField.inputValue();
  const hasTamilAfterSpace = containsTamil(output3);
  console.log(`After space: "${output3}" - Has Tamil: ${hasTamilAfterSpace}`);
  
  // Assertions for UI test
  // Should NOT have Tamil while typing
  expect(hasTamilWhileTyping, 'Should not have Tamil while typing without space').toBe(false);
  expect(hasTamilAfterVA, 'Should not have Tamil while typing without space').toBe(false);
  
  // Should have Tamil after space
  expect(hasTamilAfterSpace, 'Should have Tamil after pressing space').toBe(true);
  
  console.log('✅ UI Test PASSED: No real-time translation (as expected)');
});

// ========== SUMMARY TEST ==========

test('Test Summary - Count all tests', async () => {
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Positive tests: ${positiveTests.length} (should PASS)`);
  console.log(`Negative tests: ${negativeTests.length} (should show website failures)`);
  console.log(`UI tests: 1 (should PASS - no real-time feature)`);
  console.log(`Total tests: ${positiveTests.length + negativeTests.length + 1}`);
  
  // Verify counts
  expect(positiveTests.length).toBe(24);
  expect(negativeTests.length).toBe(10);
  
  console.log('✅ All test counts are correct');
});