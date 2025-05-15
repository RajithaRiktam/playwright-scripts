Set-Location $PSScriptRoot

# Step 1: Install dependencies
npm install
npx playwright install

# Step 2: Run tests using Playwright Test Runner
Get-Content test-sequence.txt | Where-Object { $_ -notmatch '^\s*#' -and $_.Trim() -ne "" } | ForEach-Object {
    Write-Host "Running test: $_"
    npx playwright test $_ --project=chromium --headed
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Test failed: $_"
        exit 1
    }
}
