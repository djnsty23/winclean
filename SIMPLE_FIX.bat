@echo off
REM =========================================
REM SIMPLE WINDOWS OPTIMIZATION SCRIPT
REM This version uses BAT instead of PowerShell
REM It ALWAYS works, no execution policy needed
REM =========================================

echo.
echo ========================================
echo   Windows Temp File Cleanup
echo ========================================
echo.

REM Use PowerShell to get reliable timestamp
for /f "tokens=*" %%a in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'"') do set TIMESTAMP=%%a
set LOGFILE=%USERPROFILE%\Desktop\Cleanup_Log_%TIMESTAMP%.txt

echo Starting cleanup... > "%LOGFILE%"
echo Date: %DATE% %TIME% >> "%LOGFILE%"
echo. >> "%LOGFILE%"

echo Cleaning user temp folder...
echo Cleaning: %TEMP% >> "%LOGFILE%"
del /F /S /Q "%TEMP%\*" 2>> "%LOGFILE%"
for /D %%p in ("%TEMP%\*") do rmdir "%%p" /S /Q 2>> "%LOGFILE%"
echo Done >> "%LOGFILE%"

echo Cleaning Windows temp folder...
echo Cleaning: C:\Windows\Temp >> "%LOGFILE%"
del /F /S /Q "C:\Windows\Temp\*" 2>> "%LOGFILE%"
for /D %%p in ("C:\Windows\Temp\*") do rmdir "%%p" /S /Q 2>> "%LOGFILE%"
echo Done >> "%LOGFILE%"

echo.
echo ========================================
echo   CLEANUP COMPLETE!
echo ========================================
echo.
echo Log file created at:
echo %LOGFILE%
echo.

notepad "%LOGFILE%"

pause
