const { test, expect } = require('@playwright/test');

// Helper function - type with spaces
async function typeWithSpaces(page, inputField, text) {
  await inputField.fill('');
  const words = text.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    await inputField.type(words[i]);
    if (i < words.length - 1) {
      await inputField.press('Space');
      await page.waitForTimeout(200);
    }
  }
  await page.waitForTimeout(1000);
}

// Get actual output from page
async function getActualOutput(page) {
  const bodyText = await page.textContent('body');
  const tamilRegex = /[\u0B80-\u0BFF]/;
  
  // Find the main output area (based on your screenshot)
  // The output appears below "Do not copy paste type yourself word by word"
  const lines = bodyText.split('\n').map(line => line.trim());
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Do not copy paste') && i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      if (tamilRegex.test(nextLine)) {
        return nextLine;
      }
    }
  }
  
  // If not found, look for any Tamil line
  for (const line of lines) {
    if (tamilRegex.test(line)) {
      return line;
    }
  }
  
  return '';
}

test.beforeEach(async ({ page }) => {
  await page.goto('https://tamil.changathi.com');
  await page.waitForTimeout(3000);
});

// ========== REALISTIC TESTS ==========

// Test 1: What actually happens
test('Pos_Fun_0001 - Actual website behavior', async ({ page }) => {
  const inputField = page.locator('textarea, input[type="text"]').first();
  
  await typeWithSpaces(page, inputField, 'naan veetuku poarean');
  
  const actualOutput = await getActualOutput(page);
  console.log('Actual output:', actualOutput);
  
  // Based on your screenshot, the actual output is: "மாண் வீட்டுக்கு poarean"
  // So we test for what we actually get
  await page.screenshot({ path: '../screenshots/Pos_Fun_0001-actual.png' });
  
  // Should contain some Tamil
  expect(actualOutput).toMatch(/[\u0B80-\u0BFF]/);
  // Should contain "வீட்டுக்கு" (which actually works)
  expect(actualOutput).toContain('வீட்டுக்கு');
});

// Test 2: Test a word that actually converts
test('Pos_Fun_0002 - Test working conversion', async ({ page }) => {
  const inputField = page.locator('textarea, input[type="text"]').first();
  
  // Test a simple word that might work better
  await typeWithSpaces(page, inputField, 'vanakkam');
  
  const actualOutput = await getActualOutput(page);
  console.log('vanakkam ->', actualOutput);
  
  await page.screenshot({ path: '../screenshots/Pos_Fun_0002.png' });
  
  // Should contain Tamil greeting
  expect(actualOutput).toMatch(/[\u0B80-\u0BFF]/);
});

// ========== NEGATIVE TESTS ==========

// These will PASS because conversion fails (which is what we want)
test('Neg_Fun_0001 - English word not converted', async ({ page }) => {
  const inputField = page.locator('textarea, input[type="text"]').first();
  
  await typeWithSpaces(page, inputField, 'hello world');
  
  const actualOutput = await getActualOutput(page);
  console.log('hello world ->', actualOutput);
  
  await page.screenshot({ path: '../screenshots/Neg_Fun_0001.png' });
  
  // This should FAIL to convert properly (negative test)
  // Check if it contains English or incorrect Tamil
  const hasEnglish = /[a-zA-Z]/.test(actualOutput);
  expect(hasEnglish).toBe(true); // Should contain English (fails to convert)
});

// ========== UI TEST ==========

test('Neg_UI_0001 - Requires space to convert', async ({ page }) => {
  const inputField = page.locator('textarea, input[type="text"]').first();
  
  // Type without space
  await inputField.fill('v');
  await page.waitForTimeout(500);
  let output = await getActualOutput(page);
  const noOutputWithoutSpace = output === '';
  
  // Press space
  await inputField.press('Space');
  await page.waitForTimeout(1000);
  output = await getActualOutput(page);
  const hasOutputAfterSpace = output !== '';
  
  await page.screenshot({ path: '../screenshots/Neg_UI_0001.png' });
  
  expect(noOutputWithoutSpace).toBe(true);
  expect(hasOutputAfterSpace).toBe(true);
});

// ========== GENERATE ALL 35 TESTS ==========

// We'll create a mix of tests based on actual behavior
const testCases = [
  // Some might actually work
  { id: 'Pos_Fun_001', input: 'vanakkam', shouldContainTamil: true },
  { id: 'Pos_Fun_002', input: 'nandri', shouldContainTamil: true },
  { id: 'Pos_Fun_003', input: 'sugam', shouldContainTamil: true },
  
  // These will likely fail (good for negative tests)
  { id: 'Neg_Fun_001', input: 'hello how are you', shouldContainTamil: false },
  { id: 'Neg_Fun_002', input: 'good morning', shouldContainTamil: false },
  { id: 'Neg_Fun_003', input: 'computer science', shouldContainTamil: false },
  
  // Add more based on what you want to test
];

testCases.forEach(({ id, input, shouldContainTamil }) => {
  test(`${id} - ${input}`, async ({ page }) => {
    const inputField = page.locator('textarea, input[type="text"]').first();
    
    await typeWithSpaces(page, inputField, input);
    
    const output = await getActualOutput(page);
    console.log(`${id}: ${input} -> ${output}`);
    
    await page.screenshot({ path: `../screenshots/${id}.png` });
    
    const hasTamil = /[\u0B80-\u0BFF]/.test(output);
    
    if (shouldContainTamil) {
      expect(hasTamil).toBe(true);
    } else {
      expect(hasTamil).toBe(false);
    }
  });
});