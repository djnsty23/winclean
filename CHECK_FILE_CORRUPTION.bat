@echo off
REM Check if PowerShell script file is corrupted

echo.
echo ========================================
echo   File Corruption Checker
echo ========================================
echo.

set /p SCRIPT_PATH="Drag your .ps1 file here and press ENTER: "
set SCRIPT_PATH=%SCRIPT_PATH:"=%

echo.
echo Checking file...
echo.

REM Check file size
for %%A in ("%SCRIPT_PATH%") do set SIZE=%%~zA
echo File size: %SIZE% bytes

if %SIZE% LSS 1000 (
    echo WARNING: File is very small! Might be corrupted.
) else (
    echo File size looks OK
)

REM Check if file is text
powershell -Command "try { $content = Get-Content '%SCRIPT_PATH%' -Raw; if ($content.Length -gt 0) { Write-Host 'File can be read as text: OK' -ForegroundColor Green } else { Write-Host 'File is EMPTY!' -ForegroundColor Red } } catch { Write-Host 'Cannot read file!' -ForegroundColor Red }"

REM Check for BOM or encoding issues
powershell -Command "$bytes = [System.IO.File]::ReadAllBytes('%SCRIPT_PATH%')[0..2]; Write-Host ('First 3 bytes: ' + ($bytes -join ','))"

echo.
echo Checking if file is blocked...
powershell -Command "try { $stream = Get-Item '%SCRIPT_PATH%' -Stream Zone.Identifier -ErrorAction Stop; Write-Host 'FILE IS BLOCKED!' -ForegroundColor Red; Write-Host 'You MUST unblock it!' -ForegroundColor Yellow } catch { Write-Host 'File is NOT blocked (good!)' -ForegroundColor Green }"

echo.
pause
