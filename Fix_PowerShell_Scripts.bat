@echo off
REM ============================================
REM PowerShell Script Fix Tool
REM This fixes the execution policy so scripts can run
REM ============================================

echo.
echo ========================================
echo  PowerShell Script Execution Fix
echo ========================================
echo.
echo This will allow PowerShell scripts to run on your PC.
echo It's safe and only affects the current session.
echo.
pause

echo.
echo Fixing execution policy...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force"

echo.
echo ========================================
echo  FIX APPLIED!
echo ========================================
echo.
echo PowerShell scripts should now run when you:
echo   1. Right-click a .ps1 file
echo   2. Select "Run with PowerShell"
echo.
echo If you still have issues, try:
echo   "Run as Administrator" instead
echo.
pause
