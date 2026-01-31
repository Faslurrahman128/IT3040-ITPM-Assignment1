const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting IT3040 Assignment 1 Tests...');
console.log('📸 Screenshots will be saved in /screenshots');
console.log('📊 Report will be in /playwright-report\n');

// Ensure screenshots folder exists
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

// Run tests
exec('npx playwright test --reporter=html,line', (error, stdout, stderr) => {
  console.log(stdout);
  if (stderr) console.error('Error:', stderr);
  
  if (error) {
    console.error(`Execution error: ${error}`);
    return;
  }
  
  console.log('\n✅ Tests completed!');
  console.log('📁 Check /screenshots for screenshots');
  console.log('📄 Open /playwright-report/index.html for full report');
});