Set-Location $PSScriptRoot

# Step 1: Install Node.js dependencies
npm install

# Step 2: Ensure Playwright Test is installed
npm install @playwright/test --save-dev

# Step 3: Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install

# Step 4: Run test files listed in test-sequence.txt
Get-Content test-sequence.txt | Where-Object { $_ -notmatch '^\s*#' -and $_.Trim() -ne "" } | ForEach-Object {
    Write-Host "Running test: $_"
    npx playwright test $_ --headless
    if ($LASTEXITCODE -ne 0) {
        Write-Host " Test failed: $_"
        exit 1
    }
}
