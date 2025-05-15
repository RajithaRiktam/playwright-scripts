Set-Location $PSScriptRoot

# Step 1: Install Node.js dependencies
npm install

# Step 2: Install Playwright browsers
npx playwright install

# Step 3: Run all test files listed in test-sequence.txt
Get-Content test-sequence.txt | Where-Object { $_ -notmatch '^\s*#' -and $_.Trim() -ne "" } | ForEach-Object {
    Write-Host "Running test: $_"
    npx playwright test $_ --headless
    if ($LASTEXITCODE -ne 0) {
        Write-Host " Test failed: $_"
        exit 1
    }
}
