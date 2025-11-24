@echo off
REM This batch file will NEVER close until you press a key
REM It will show EXACTLY what's happening

echo.
echo ========================================
echo   EMERGENCY DIAGNOSTIC - STAY OPEN
echo ========================================
echo.

set /p SCRIPT_PATH="Drag your .ps1 file here and press ENTER: "
set SCRIPT_PATH=%SCRIPT_PATH:"=%

echo.
echo Script path: %SCRIPT_PATH%
echo.
echo Checking if file exists...
if exist "%SCRIPT_PATH%" (
    echo SUCCESS: File found!
    echo File size:
    dir "%SCRIPT_PATH%" | find ".ps1"
) else (
    echo ERROR: File NOT found!
    echo You may have dragged incorrectly.
)

echo.
echo Testing if PowerShell.exe exists...
where powershell.exe
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS: PowerShell found!
) else (
    echo ERROR: PowerShell NOT found on this system!
)

echo.
echo Attempting to run PowerShell with maximum error detail...
echo Command: powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_PATH%"
echo.
echo ========================================
echo   OUTPUT STARTS BELOW:
echo ========================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_PATH%" 2>&1

echo.
echo ========================================
echo   OUTPUT ENDED ABOVE
echo ========================================
echo.
echo PowerShell exit code: %ERRORLEVEL%
echo.
echo If nothing appeared above, PowerShell is being BLOCKED!
echo Check:
echo   1. Windows Defender quarantine
echo   2. Antivirus software
echo   3. Group Policy restrictions
echo.
echo THIS WINDOW WILL STAY OPEN.
echo.
pause
