@echo off
REM ============================================
REM PowerShell Script Error Capture Wrapper
REM This captures ALL errors and saves to file
REM ============================================

echo.
echo ========================================
echo   PowerShell Script Error Capture
echo ========================================
echo.
echo This will run your PowerShell script and
echo capture ANY errors to a log file.
echo.

REM Get the script file
set /p SCRIPT_PATH="Drag and drop your .ps1 file here, then press ENTER: "

REM Remove quotes if present
set SCRIPT_PATH=%SCRIPT_PATH:"=%

echo.
echo Running script and capturing all output...
echo.

REM Create error log file
set ERROR_LOG=%USERPROFILE%\Desktop\PowerShell_Error_Capture_%DATE:~-4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%.txt
set ERROR_LOG=%ERROR_LOG: =0%

REM Run PowerShell and capture EVERYTHING
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_PATH%" 2>&1 | tee "%ERROR_LOG%"

echo.
echo ========================================
echo   Capture Complete!
echo ========================================
echo.
echo Log saved to:
echo %ERROR_LOG%
echo.
echo Opening log file...
notepad "%ERROR_LOG%"

echo.
pause
