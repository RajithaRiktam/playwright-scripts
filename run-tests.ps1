npx playwright install

Get-Content test-sequence.txt | Where-Object { $_ -notmatch '^\s*#' -and $_.Trim() -ne "" } | ForEach-Object {
    Write-Host "Running test: $_"
    npx playwright test $_ --headless
    if ($LASTEXITCODE -ne 0) {
        Write-Host " Test failed: $_"
        exit 1
    }
}
