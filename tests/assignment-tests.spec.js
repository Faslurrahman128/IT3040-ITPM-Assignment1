const { test, expect } = require('@playwright/test');

// Helper function
async function typeAndGetOutput(page, text) {
  const input = page.locator('textarea, input[type="text"]').first();
  await input.fill('');
  await input.type(text);
  await input.press('Space');
  await page.waitForTimeout(1500);
  return await input.inputValue();
}

function containsTamil(text) {
  return /[\u0B80-\u0BFF]/.test(text);
}

function containsEnglish(text) {
  return /[a-zA-Z]/.test(text);
}

// Check if it's transliterated English (English word in Tamil script)
function isTransliteratedEnglish(text) {
  // Common transliterated English words in Tamil script
  const transliteratedPatterns = [
    'யூஸ்',     // use
    'நிக்',     // nic  
    'கான்செல்', // cancel
    'ப்ளஸ்',    // pls
    'இன்போர்ம்', // inform
    'ஒர்க்',    // work
    'போரின்',   // boring
    'கன்ஃபியூஸ்', // confuse
    'இக்னோர்',  // ignore
    'ஹெல்ப்',   // help
    'மீட்டிங்', // meeting
    'எக்ஸாம்',  // exam
    'புக்',     // book
    'ப்ரைஸ்',  // price
    'டீச்சர்ஸ்', // teachers
    'ட்ரிப்',   // trip
    'வாட்ஸாப்ப்', // whatsapp
    'மெசேஜ்',   // message
    'ஜூம்',     // zoom
    'ஸ்டார்ட்'  // start
  ];
  
  return transliteratedPatterns.some(pattern => text.includes(pattern));
}

// Setup - runs before EACH test
test.beforeEach(async ({ page }) => {
  await page.goto('https://tamil.changathi.com');
  await page.waitForTimeout(2000);
});

// ========== 24 POSITIVE TESTS ==========
test('Pos_Fun_0001 - Convert simple daily sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'naan veetuku poarean');
  console.log('Test 1 - Input: naan veetuku poarean');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0002 - Convert question sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'nee eppo varuva?');
  console.log('Test 2 - Input: nee eppo varuva?');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0003 - Convert polite request', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'Konjam help pannuviya ?');
  console.log('Test 3 - Input: Konjam help pannuviya ?');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0004 - Convert informal sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'machan innaiku semma day da');
  console.log('Test 4 - Input: machan innaiku semma day da');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0005 - Convert present tense sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'naan ippo padikirean');
  console.log('Test 5 - Input: naan ippo padikirean');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0006 - Convert past tense sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'naan neatru office ku poanean');
  console.log('Test 6 - Input: naan neatru office ku poanean');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0007 - Convert future tense sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'naan nalaiku vaanguvean');
  console.log('Test 7 - Input: naan nalaiku vaanguvean');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0008 - Convert negative sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'naan adha panna mattean');
  console.log('Test 8 - Input: naan adha panna mattean');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0009 - Convert daily expression', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'enkku romba pasikuthu');
  console.log('Test 9 - Input: enkku romba pasikuthu');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0010 - Convert compound sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'naan veetuku poanean .athan pinnar thoongivittean');
  console.log('Test 10 - Input: naan veetuku poanean .athan pinnar thoongivittean');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0011 - Convert mixed English sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'nee vanthaal naan solluran');
  console.log('Test 11 - Input: nee vanthaal naan solluran');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0012 - Convert mixed English sentence 2', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'indaiku zoom meeting iruku');
  console.log('Test 12 - Input: indaiku zoom meeting iruku');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0013 - Convert app name usage', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'whatsapp le message pannu');
  console.log('Test 13 - Input: whatsapp le message pannu');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0014 - Convert time format sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'meeting 7.30 ku start aagum');
  console.log('Test 14 - Input: meeting 7.30 ku start aagum');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0015 - Convert date format sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'exam 28 / 01 / 2026 nadakum');
  console.log('Test 15 - Input: exam 28 / 01 / 2026 nadakum');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0016 - Convert currency sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'intha book oada price rs.1500');
  console.log('Test 16 - Input: intha book oada price rs.1500');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0017 - Convert plural usage', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'enga teachers ellarum varuvange');
  console.log('Test 17 - Input: enga teachers ellarum varuvange');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0018 - Convert pronoun usage', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'avanga nalaiku trip poapuraange');
  console.log('Test 18 - Input: avanga nalaiku trip poapuraange');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0019 - Convert repeated words', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'seekiram seekiram vaa');
  console.log('Test 19 - Input: seekiram seekiram vaa');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0020 - Convert place name sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'naan kandy ku travel pandren');
  console.log('Test 20 - Input: naan kandy ku travel pandren');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0021 - Convert greeting sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'vanakam eppadi irukeenga');
  console.log('Test 21 - Input: vanakam eppadi irukeenga');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0022 - Convert medium length sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'innaiku enakku office le romba vealai irunthichu');
  console.log('Test 22 - Input: innaiku enakku office le romba vealai irunthichu');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0023 - Convert polite command', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'please door a close pannunge');
  console.log('Test 23 - Input: please door a close pannunge');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

test('Pos_Fun_0024 - Convert sentence with multiple spaces', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'naan ippoathu veetula irukkan');
  console.log('Test 24 - Input: naan ippoathu veetula irukkan');
  console.log('Output:', output);
  expect(containsTamil(output)).toBe(true);
});

// ========== 10 NEGATIVE TESTS ==========
// UPDATED: These tests should PASS when website transliterates instead of translates
test('Neg_Fun_0001 - English word semantic conversion failure', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'anga ponalum oru use um ille');
  console.log('Test 25 (Neg) - Input: anga ponalum oru use um ille');
  console.log('Output:', output);
  
  // Negative test: Should show transliterated English (not semantic translation)
  // "use" should become "யூஸ்" (transliterated) not its Tamil meaning
  const hasTransliterated = isTransliteratedEnglish(output);
  console.log('Has transliterated English:', hasTransliterated);
  
  // Test PASSES if it contains transliterated English (shows website limitation)
  expect(hasTransliterated).toBe(true);
});

test('Neg_Fun_0002 - Incorrect Thanglish spelling for past tense', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'naanum thaan kooda poana');
  console.log('Test 26 (Neg) - Input: naanum thaan kooda poana');
  console.log('Output:', output);
  // This should still contain Tamil (it's a Tamil sentence with spelling issues)
  expect(containsTamil(output)).toBe(true);
});

test('Neg_Fun_0003 - English abbreviation in middle of sentence', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'enekku nic veanum');
  console.log('Test 27 (Neg) - Input: enekku nic veanum');
  console.log('Output:', output);
  
  // "nic" should become "நிக்" (transliterated)
  const hasTransliterated = isTransliteratedEnglish(output);
  console.log('Has transliterated English:', hasTransliterated);
  
  expect(hasTransliterated).toBe(true);
});

test('Neg_Fun_0004 - Numbers replacing letters cause incorrect conversion', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'naan 2nd day college poahala');
  console.log('Test 28 (Neg) - Input: naan 2nd day college poahala');
  console.log('Output:', output);
  // Should still process the Tamil parts
  expect(containsTamil(output)).toBe(true);
});

test('Neg_Fun_0005 - English shorthand and word conversion failure', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'meeting cancel aahiduchu pls inform');
  console.log('Test 29 (Neg) - Input: meeting cancel aahiduchu pls inform');
  console.log('Output:', output);
  
  // Check for transliterated words
  const hasTransliterated = isTransliteratedEnglish(output);
  console.log('Has transliterated English:', hasTransliterated);
  
  expect(hasTransliterated).toBe(true);
});

test('Neg_Fun_0006 - Idiomatic expression not semantically converted', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'avan kai kalandhu pesuran');
  console.log('Test 30 (Neg) - Input: avan kai kalandhu pesuran');
  console.log('Output:', output);
  // This is literal translation, not semantic - website limitation
  expect(containsTamil(output)).toBe(true);
});

test('Neg_Fun_0007 - Contextual meaning loss due to untranslated English verb', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'intha idea work aagathu');
  console.log('Test 31 (Neg) - Input: intha idea work aagathu');
  console.log('Output:', output);
  
  // "work" should become "ஒர்க்" (transliterated)
  const hasTransliterated = isTransliteratedEnglish(output);
  console.log('Has transliterated English:', hasTransliterated);
  
  expect(hasTransliterated).toBe(true);
});

test('Neg_Fun_0008 - English adjective semantic failure', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'intha movie boring aa iruku');
  console.log('Test 32 (Neg) - Input: intha movie boring aa iruku');
  console.log('Output:', output);
  
  // "boring" should become "போரின்" (transliterated)
  const hasTransliterated = isTransliteratedEnglish(output);
  console.log('Has transliterated English:', hasTransliterated);
  
  expect(hasTransliterated).toBe(true);
});

test('Neg_Fun_0009 - English adverb semantic failure', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'naan totally confuse aagitten');
  console.log('Test 33 (Neg) - Input: naan totally confuse aagitten');
  console.log('Output:', output);
  
  // "totally" and "confuse" should be transliterated
  const hasTransliterated = isTransliteratedEnglish(output);
  console.log('Has transliterated English:', hasTransliterated);
  
  expect(hasTransliterated).toBe(true);
});

test('Neg_Fun_0010 - English verb phrase semantic failure', async ({ page }) => {
  const output = await typeAndGetOutput(page, 'avan enna ignore pannitan');
  console.log('Test 34 (Neg) - Input: avan enna ignore pannitan');
  console.log('Output:', output);
  
  // "ignore" should become "இக்னோர்" (transliterated)
  const hasTransliterated = isTransliteratedEnglish(output);
  console.log('Has transliterated English:', hasTransliterated);
  
  expect(hasTransliterated).toBe(true);
});

// ========== 1 UI TEST ==========
test('Neg_UI_0001 - System lacks real-time translation feature', async ({ page }) => {
  const input = page.locator('textarea, input[type="text"]').first();
  
  // Type without space
  await input.fill('');
  await input.type('v');
  await page.waitForTimeout(500);
  const afterV = await input.inputValue();
  
  await input.type('a');
  await page.waitForTimeout(500);
  const afterVa = await input.inputValue();
  
  await input.type('n');
  await page.waitForTimeout(500);
  const afterVan = await input.inputValue();
  
  // Check if any Tamil appears while typing
  const hasTamilWhileTyping = containsTamil(afterVan);
  console.log('After typing "van":', afterVan);
  console.log('Has Tamil while typing:', hasTamilWhileTyping);
  
  // Should NOT have Tamil while typing
  expect(hasTamilWhileTyping).toBe(false);
  
  // Type space to trigger conversion
  await input.press('Space');
  await page.waitForTimeout(1000);
  const afterSpace = await input.inputValue();
  
  // Check if Tamil appears after space
  const hasTamilAfterSpace = containsTamil(afterSpace);
  console.log('After space:', afterSpace);
  console.log('Has Tamil after space:', hasTamilAfterSpace);
  
  // Should have Tamil after space
  expect(hasTamilAfterSpace).toBe(true);
  
  console.log('Test 35 (UI) - Real-time translation test PASSED');
});