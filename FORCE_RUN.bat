@echo off
REM ============================================
REM NUCLEAR OPTION - Forces PowerShell to show errors
REM ============================================

echo.
echo ========================================
echo   FORCING POWERSHELL TO RUN AND SHOW ERRORS
echo ========================================
echo.
echo Drag and drop your .ps1 file here and press ENTER:
echo.

set /p SCRIPT_PATH=

REM Remove quotes
set SCRIPT_PATH=%SCRIPT_PATH:"=%

echo.
echo Running with MAXIMUM error visibility...
echo.
echo ========================================
echo.

REM Run PowerShell with every possible flag to show errors
powershell.exe -NoProfile -ExecutionPolicy Bypass -NonInteractive -NoExit -Command "& { try { & '%SCRIPT_PATH%' } catch { Write-Host ''; Write-Host 'CAUGHT ERROR:' -ForegroundColor Red; Write-Host $_.Exception.Message -ForegroundColor Yellow; Write-Host ''; Write-Host $_.InvocationInfo.PositionMessage -ForegroundColor Gray; Write-Host ''; Read-Host 'Press Enter to see full details'; $_ | Format-List * -Force } }"

echo.
echo ========================================
echo.
pause
