const { test, expect } = require('@playwright/test');
const fs = require('fs');

// ========== CONFIG ==========
const SCREENSHOT_DIR = 'screenshots';

// ========== UTILITIES ==========
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Type text word-by-word (site converts on SPACE)
async function typeText(page, inputField, text) {
  await inputField.fill('');
  const words = text.split(' ');
  for (const word of words) {
    await inputField.type(word);
    await inputField.press(' ');
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(800);
}

function containsTamil(text) {
  return /[\u0B80-\u0BFF]/.test(text);
}

// ========== SETUP ==========
test.beforeEach(async ({ page }) => {
  await page.goto('https://tamil.changathi.com', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
});

// ========== POSITIVE TESTS ==========
const positiveTests = [
  { id: 'Pos_01', input: 'vanakam', expected: 'வணக்கம்' },
  { id: 'Pos_02', input: 'nandri', expected: 'நன்றி' },
  { id: 'Pos_03', input: 'sugam', expected: 'சுகம்' },
  { id: 'Pos_04', input: 'nalama', expected: 'நலமா' },
  { id: 'Pos_05', input: 'poitu varen', expected: 'போயிட்டு' },
  { id: 'Pos_06', input: 'en peyar', expected: 'பெயர்' },
  { id: 'Pos_07', input: 'ungal peyar enna', expected: 'உங்கள்' },
  { id: 'Pos_08', input: 'epadi irukinga', expected: 'எப்படி' },
  { id: 'Pos_09', input: 'romba nalla iruku', expected: 'நல்ல' },
  { id: 'Pos_10', input: 'intha padam nalla iruku', expected: 'படம்' },
  { id: 'Pos_11', input: 'ungalukku pidichathaa', expected: 'உங்களுக்கு' },
  { id: 'Pos_12', input: 'sari', expected: 'சரி' },
  { id: 'Pos_13', input: 'paravailla', expected: 'பரவாயில்ல' },
  { id: 'Pos_14', input: 'kadhal', expected: 'காதல்' },
  { id: 'Pos_15', input: 'veetuku', expected: 'வீட்டுக்கு' },
  { id: 'Pos_16', input: 'officeku', expected: 'ஆபீஸ்' },
  { id: 'Pos_17', input: 'pogiren', expected: 'போகிறேன்' },
  { id: 'Pos_18', input: 'varuven', expected: 'வருவேன்' },
  { id: 'Pos_19', input: 'padikiren', expected: 'படிக்கிறேன்' },
  { id: 'Pos_20', input: 'sapten', expected: 'சாப்பிட்டேன்' },
  { id: 'Pos_21', input: 'thanginen', expected: 'தங்கினேன்' },
  { id: 'Pos_22', input: 'parkiren', expected: 'பார்க்கிறேன்' },
  { id: 'Pos_23', input: 'nanri', expected: 'நன்றி' },
  { id: 'Pos_24', input: 'ungalukku romba nandri', expected: 'நன்றி' },
];

positiveTests.forEach(({ id, input, expected }) => {
  test(`${id} – ${input}`, async ({ page }) => {
    const inputField = page.locator('textarea, input[type="text"]').first();
    await expect(inputField).toBeVisible();

    await typeText(page, inputField, input);
    const output = await inputField.inputValue();

    await page.screenshot({ path: `${SCREENSHOT_DIR}/${id}.png` });

    expect(containsTamil(output)).toBe(true);
    expect(output).toContain(expected);
  });
});

// ========== NEGATIVE TESTS ==========
const negativeTests = [
  'hello world',
  'computer science',
  'good morning',
  'thank you',
  'what is this',
  'how are you',
  'i love you',
  'software engineering',
  'playwright testing',
  'test case',
];

negativeTests.forEach((input, index) => {
  test(`Neg_${index + 1} – ${input}`, async ({ page }) => {
    const inputField = page.locator('textarea, input[type="text"]').first();
    await expect(inputField).toBeVisible();

    await typeText(page, inputField, input);
    const output = await inputField.inputValue();

    await page.screenshot({ path: `${SCREENSHOT_DIR}/Neg_${index + 1}.png` });

    // Correct negative logic:
    // Website SHOULD NOT properly convert pure English
    const tamilPresent = containsTamil(output);
    const englishPresent = /[a-zA-Z]/.test(output);

    expect(tamilPresent && !englishPresent).toBeFalsy();
  });
});

// ========== UI TEST ==========
test('Neg_UI – No real-time conversion', async ({ page }) => {
  const inputField = page.locator('textarea, input[type="text"]').first();
  await expect(inputField).toBeVisible();

  await inputField.fill('');
  await inputField.type('v');
  await page.waitForTimeout(400);
  expect(containsTamil(await inputField.inputValue())).toBe(false);

  await inputField.type('a');
  await page.waitForTimeout(400);
  expect(containsTamil(await inputField.inputValue())).toBe(false);

  await inputField.press(' ');
  await page.waitForTimeout(600);
  expect(containsTamil(await inputField.inputValue())).toBe(true);

  await page.screenshot({ path: `${SCREENSHOT_DIR}/Neg_UI.png` });
});
