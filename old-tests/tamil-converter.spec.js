const { test, expect } = require('@playwright/test');
const fs = require('fs');

// ================= CONFIG =================
const SCREENSHOTS_DIR = 'screenshots';
const TEST_TIMEOUT = 15000;

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// ================= HELPERS =================

// Type word-by-word (conversion happens on SPACE)
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

// Detect Tamil characters
function containsTamil(text) {
  return /[\u0B80-\u0BFF]/.test(text);
}

// 🔥 NORMALIZATION FUNCTION (THIS FIXES YOUR ISSUE)
function normalizeTamil(text) {
  if (!text) return '';
  return text
    .normalize('NFKC')                 // Unicode normalization
    .replace(/\u200B/g, '')            // remove zero-width chars
    .replace(/[.,!?]/g, '')            // punctuation
    .replace(/\s+/g, ' ')              // extra spaces
    .trim();
}

// ================= SETUP =================
test.beforeEach(async ({ page }) => {
  await page.goto('https://tamil.changathi.com', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(2000);
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/${testInfo.title.replace(/[^a-z0-9]/gi, '_')}.png`
    });
  }
});

// ================= POSITIVE TESTS (24 – MUST PASS) =================

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
    test.setTimeout(TEST_TIMEOUT);

    const inputField = page.locator('textarea, input[type="text"]').first();
    await expect(inputField).toBeVisible();

    await typeText(page, inputField, input);

    const rawOutput = await inputField.inputValue();
    const output = normalizeTamil(rawOutput);
    const expectedNorm = normalizeTamil(expected);

    expect(containsTamil(output)).toBe(true);
    expect(output).toContain(expectedNorm);
  });
});

// ================= NEGATIVE TESTS (10 – MUST FAIL CONVERSION) =================

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

    const output = normalizeTamil(await inputField.inputValue());
    const hasTamil = containsTamil(output);
    const hasEnglish = /[a-zA-Z]/.test(output);

    // ❌ Must NOT be clean Tamil conversion
    expect(hasTamil && !hasEnglish).toBeFalsy();
  });
});

// ================= UI TEST =================

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
});
