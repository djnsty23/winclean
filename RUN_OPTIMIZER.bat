@echo off
REM This batch file runs the Windows Optimizer script from Downloads folder
REM No dragging needed - just double-click this!

echo.
echo ========================================
echo   Windows Optimizer Script Runner
echo ========================================
echo.

REM Find the most recent Windows_Optimizer script in Downloads
for /f "delims=" %%i in ('dir "%USERPROFILE%\Downloads\Windows_Optimizer_*.ps1" /b /o-d 2^>nul') do (
    set SCRIPT=%%i
    goto :found
)

echo ERROR: No Windows_Optimizer script found in Downloads folder!
echo.
echo Please download the script from GitHub Pages first.
echo.
pause
exit /b 1

:found
echo Found script: %SCRIPT%
echo.
echo Running PowerShell script...
echo.
echo ========================================
echo.

REM Run the script and keep window open
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%USERPROFILE%\Downloads\%SCRIPT%"

echo.
echo ========================================
echo   Script execution finished
echo ========================================
echo.
echo Exit code: %ERRORLEVEL%
echo.
pause
