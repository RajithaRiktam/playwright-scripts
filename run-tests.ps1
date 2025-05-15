Set-Location $PSScriptRoot

# Install dependencies
npm install
npm install @playwright/test --save-dev
npx playwright install

# Run test files listed in test-sequence.txt
Get-Content test-sequence.txt | Where-Object { $_ -notmatch '^\s*#' -and $_.Trim() -ne "" } | ForEach-Object {
    Write-Host "`nRunning test: $_"

    # Read the file and check if it uses @playwright/test
    $content = Get-Content $_ -Raw
    if ($content -match "@playwright/test") {
        npx playwright test $_ --headless
    }
    else {
        npx node $_
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Test failed: $_"
        exit 1
    }
}
