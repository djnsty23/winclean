# ============================================
# DIAGNOSTIC TEST SCRIPT
# This tests if PowerShell can run at all
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PowerShell Diagnostic Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Basic execution
Write-Host "[TEST 1] Basic execution..." -ForegroundColor Yellow
Write-Host "  ✓ PowerShell is running!" -ForegroundColor Green
Write-Host ""

# Test 2: File write permission
Write-Host "[TEST 2] Testing file write permissions..." -ForegroundColor Yellow
try {
    $testFile = "$env:USERPROFILE\Desktop\Test_File_DELETE_ME.txt"
    "Test" | Out-File -FilePath $testFile -Force
    if (Test-Path $testFile) {
        Write-Host "  ✓ Can write to Desktop!" -ForegroundColor Green
        Remove-Item $testFile -Force
    } else {
        Write-Host "  ❌ Cannot write to Desktop!" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Error writing to Desktop: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Admin check
Write-Host "[TEST 3] Checking administrator status..." -ForegroundColor Yellow
try {
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if ($isAdmin) {
        Write-Host "  ✓ Running as Administrator" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  NOT running as Administrator" -ForegroundColor Yellow
        Write-Host "     (This is OK for testing, but main script may need admin)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ❌ Error checking admin status: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: PowerShell version
Write-Host "[TEST 4] PowerShell version..." -ForegroundColor Yellow
Write-Host "  Version: $($PSVersionTable.PSVersion)" -ForegroundColor White
if ($PSVersionTable.PSVersion.Major -ge 5) {
    Write-Host "  ✓ Version is compatible" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Version is old (may have issues)" -ForegroundColor Yellow
}
Write-Host ""

# Test 5: Execution policy
Write-Host "[TEST 5] Execution policy..." -ForegroundColor Yellow
$policy = Get-ExecutionPolicy
Write-Host "  Current policy: $policy" -ForegroundColor White
if ($policy -eq "Restricted") {
    Write-Host "  ⚠️  Policy is RESTRICTED - this blocks scripts!" -ForegroundColor Yellow
    Write-Host "     To fix: Right-click script → Properties → Unblock" -ForegroundColor Gray
} else {
    Write-Host "  ✓ Policy allows scripts" -ForegroundColor Green
}
Write-Host ""

# Test 6: Error handling
Write-Host "[TEST 6] Testing error handling..." -ForegroundColor Yellow
try {
    Write-Host "  Creating intentional error..." -ForegroundColor Gray
    $null = 1 / 0
} catch {
    Write-Host "  ✓ Errors are being caught correctly!" -ForegroundColor Green
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Diagnostic Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you see this message, PowerShell is working!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
