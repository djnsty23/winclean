@echo off
REM ============================================
REM PowerShell Syntax Checker
REM This checks if your script has syntax errors
REM ============================================

echo.
echo ========================================
echo   PowerShell Script Syntax Checker
echo ========================================
echo.

set /p SCRIPT_PATH="Drag and drop your .ps1 file here, then press ENTER: "
set SCRIPT_PATH=%SCRIPT_PATH:"=%

echo.
echo Checking syntax...
echo.

powershell.exe -NoProfile -Command "try { $null = [System.Management.Automation.PSParser]::Tokenize((Get-Content '%SCRIPT_PATH%' -Raw), [ref]$null); Write-Host 'SUCCESS: Script syntax is VALID!' -ForegroundColor Green } catch { Write-Host 'ERROR: Script has syntax errors!' -ForegroundColor Red; Write-Host $_.Exception.Message -ForegroundColor Yellow }"

echo.
echo ========================================
echo.
pause
