Write-Host "=== RUNNING FINAL ASSIGNMENT TESTS ===" -ForegroundColor Cyan
Write-Host "Expected: 35 tests total (24 positive + 10 negative + 1 UI)" -ForegroundColor Yellow

# Clean previous results
Remove-Item playwright-report -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item test-results -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item screenshots -Recurse -Force -ErrorAction SilentlyContinue

# Create screenshots directory
New-Item -ItemType Directory -Path screenshots -Force | Out-Null

# Run tests
Write-Host "`nStarting tests..." -ForegroundColor Green

$output = npx playwright test --timeout=90000 --reporter=line,html 2>&1

# Display results
Write-Host "`n=== TEST RESULTS ===" -ForegroundColor Cyan
$outputLines = $output -split "`n"

foreach ($line in $outputLines) {
    if ($line -match "passed") {
        Write-Host $line -ForegroundColor Green
    } elseif ($line -match "failed") {
        Write-Host $line -ForegroundColor Red
    } elseif ($line -match "(\d+)/(\d+) tests?") {
        Write-Host $line -ForegroundColor Yellow
    } elseif ($line -match "Error:|FAIL") {
        Write-Host $line -ForegroundColor Red
    }
}

# Open HTML report
if (Test-Path "playwright-report\index.html") {
    Write-Host "`nOpening HTML report..." -ForegroundColor Cyan
    Start-Process "playwright-report\index.html"
}

# Final summary
Write-Host "`n=== FINAL SUMMARY ===" -ForegroundColor Magenta
Write-Host "24 Positive Tests: Should PASS (contain Tamil)" -ForegroundColor White
Write-Host "10 Negative Tests: Should PASS (show transliterated English, not semantic translation)" -ForegroundColor White  
Write-Host "1 UI Test: Should PASS (no real-time translation)" -ForegroundColor White
Write-Host "`nTotal: 35 tests" -ForegroundColor White