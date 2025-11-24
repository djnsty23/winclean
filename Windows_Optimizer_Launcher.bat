@echo off
:: Windows Optimizer Launcher v2.0
:: Auto-elevates to admin and provides menu system

color 0B
title Windows Optimizer - Launcher

:: Check for admin privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :MENU
) else (
    echo.
    echo ============================================================
    echo  REQUESTING ADMINISTRATOR PRIVILEGES
    echo ============================================================
    echo.
    echo This script needs admin rights to optimize your system.
    echo Requesting elevation...
    echo.
    
    :: Re-launch as admin
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:MENU
cls
echo.
echo ============================================================
echo            WINDOWS 11 OPTIMIZER - MAIN MENU
echo ============================================================
echo.
echo  What would you like to do?
echo.
echo  [1] Run One-Time Optimization Now
echo  [2] Schedule Recurring Maintenance
echo  [3] View Last Optimization Log
echo  [4] View Startup Programs Report
echo  [5] Restore Previous Settings
echo  [6] Exit
echo.
echo ============================================================
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto RUN_NOW
if "%choice%"=="2" goto SCHEDULE
if "%choice%"=="3" goto VIEW_LOG
if "%choice%"=="4" goto VIEW_STARTUP
if "%choice%"=="5" goto RESTORE
if "%choice%"=="6" goto EXIT
echo Invalid choice. Please try again.
timeout /t 2 >nul
goto MENU

:RUN_NOW
cls
echo.
echo ============================================================
echo          RUNNING ONE-TIME OPTIMIZATION
echo ============================================================
echo.

:: Find the most recent optimizer script (not SCHEDULED, not PREVIEW)
for /f "delims=" %%i in ('dir /b /o-d "Windows_Optimizer_*.ps1" 2^>nul ^| findstr /v "SCHEDULED PREVIEW"') do (
    set "SCRIPT=%%i"
    goto :FOUND_SCRIPT
)

:FOUND_SCRIPT
if not defined SCRIPT (
    echo ============================================================
    echo  NO SCRIPTS FOUND!
    echo ============================================================
    echo.
    echo Please generate scripts first:
    echo.
    echo  1. Open index.html in your browser
    echo  2. Select your desired optimizations
    echo  3. Click "Generate Optimization Script"
    echo  4. Download both scripts to this folder
    echo  5. Run this launcher again
    echo.
    echo ============================================================
    pause
    goto MENU
)

echo Found script: %SCRIPT%
echo.
echo Starting optimization with admin privileges...
echo.
echo ============================================================
echo.

:: Run with admin (already elevated from launcher start)
powershell -ExecutionPolicy Bypass -NoProfile -Command "& {& '%CD%\%SCRIPT%'}"

echo.
echo ============================================================
echo  OPTIMIZATION COMPLETE
echo ============================================================
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:SCHEDULE
cls
echo.
echo ============================================================
echo          SCHEDULE RECURRING MAINTENANCE
echo ============================================================
echo.

:: Find scheduled script first
set "SCHED_SCRIPT="
for /f "delims=" %%i in ('dir /b /o-d "Windows_Optimizer_SCHEDULED_*.ps1" 2^>nul') do (
    set "SCHED_SCRIPT=%%i"
    goto :FOUND_SCHED
)

:FOUND_SCHED
if not defined SCHED_SCRIPT (
    echo ============================================================
    echo  NO SCHEDULED SCRIPT FOUND!
    echo ============================================================
    echo.
    echo Please generate scripts first:
    echo.
    echo  1. Open index.html in your browser
    echo  2. Select your desired optimizations
    echo  3. Click "Generate Optimization Script"
    echo  4. Download both scripts to this folder
    echo  5. Run this launcher again
    echo.
    echo The SCHEDULED script only runs recurring tasks like:
    echo  - Temp file cleanup
    echo  - Old update removal
    echo  - System log clearing
    echo.
    echo ============================================================
    pause
    goto MENU
)

echo Found scheduled script: %SCHED_SCRIPT%
echo.
echo This will create an automated task that runs:
echo  - Temp file cleanup
echo  - Old Windows update removal
echo  - System log clearing
echo.
echo (Privacy/Performance settings are one-time only)
echo.
echo ============================================================
echo.
echo How often should maintenance run?
echo.
echo  [1] Daily   - For heavy computer use
echo  [2] Weekly  - Recommended for most users
echo  [3] Monthly - For light use
echo  [B] Back to Main Menu
echo.

set /p freq="Enter your choice (1-3 or B): "

if /i "%freq%"=="B" goto MENU
if "%freq%"=="1" set FREQUENCY=Daily
if "%freq%"=="2" set FREQUENCY=Weekly
if "%freq%"=="3" set FREQUENCY=Monthly

if not defined FREQUENCY (
    echo Invalid choice.
    timeout /t 2 >nul
    goto SCHEDULE
)

echo.
echo At what hour should it run? (0-23, e.g., 2 for 2 AM, 14 for 2 PM)
set /p hour="Enter hour: "

:: Validate hour
if %hour% LSS 0 goto INVALID_HOUR
if %hour% GTR 23 goto INVALID_HOUR

echo.
echo ============================================================
echo  CREATING SCHEDULED TASK
echo ============================================================
echo.
echo Task Name: Windows Optimizer Maintenance
echo Frequency: %FREQUENCY%
echo Time:      %hour%:00
echo Script:    %SCHED_SCRIPT%
echo.

:: Remove existing task if present
schtasks /query /tn "Windows Optimizer Maintenance" >nul 2>&1
if %errorlevel% == 0 (
    echo Removing existing task...
    schtasks /delete /tn "Windows Optimizer Maintenance" /f >nul
)

:: Create scheduled task with proper escaping
if "%FREQUENCY%"=="Daily" (
    schtasks /create /tn "Windows Optimizer Maintenance" /tr "powershell.exe -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File \"\"%CD%\%SCHED_SCRIPT%\"\"" /sc daily /st %hour%:00 /rl highest /f
)
if "%FREQUENCY%"=="Weekly" (
    schtasks /create /tn "Windows Optimizer Maintenance" /tr "powershell.exe -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File \"\"%CD%\%SCHED_SCRIPT%\"\"" /sc weekly /d SUN /st %hour%:00 /rl highest /f
)
if "%FREQUENCY%"=="Monthly" (
    schtasks /create /tn "Windows Optimizer Maintenance" /tr "powershell.exe -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File \"\"%CD%\%SCHED_SCRIPT%\"\"" /sc monthly /d 1 /st %hour%:00 /rl highest /f
)

if %errorlevel% == 0 (
    echo.
    echo ============================================================
    echo  SUCCESS! TASK SCHEDULED
    echo ============================================================
    echo.
    echo Your automated maintenance is now set up!
    echo.
    echo Task will run: %FREQUENCY% at %hour%:00
    echo Next run will clean temp files, old updates, and logs.
    echo.
    echo To manage this task:
    echo  1. Press Win+R
    echo  2. Type: taskschd.msc
    echo  3. Find "Windows Optimizer Maintenance"
    echo  4. Right-click to Run/Edit/Disable/Delete
    echo.
) else (
    echo.
    echo ============================================================
    echo  ERROR CREATING TASK
    echo ============================================================
    echo.
    echo Failed to create scheduled task.
    echo Make sure this launcher is running as Administrator.
    echo.
)

pause
goto MENU

:INVALID_HOUR
echo Invalid hour. Please enter a number between 0 and 23.
timeout /t 2 >nul
goto SCHEDULE

:VIEW_LOG
cls
echo.
echo ============================================================
echo          VIEWING LAST OPTIMIZATION LOG
echo ============================================================
echo.

:: Find most recent log
for /f "delims=" %%i in ('dir /b /o-d "Windows_Optimization_Log_*.txt" 2^>nul') do (
    set "LOG=%%i"
    goto :FOUND_LOG
)

:FOUND_LOG
if not defined LOG (
    echo No log files found yet.
    echo Run an optimization first!
    echo.
    pause
    goto MENU
)

echo Opening: %LOG%
echo.
notepad "%LOG%"
goto MENU

:VIEW_STARTUP
cls
echo.
echo ============================================================
echo          VIEWING STARTUP PROGRAMS REPORT
echo ============================================================
echo.

:: Find most recent startup report
for /f "delims=" %%i in ('dir /b /o-d "Startup_Report_*.html" 2^>nul') do (
    set "REPORT=%%i"
    goto :FOUND_REPORT
)

:FOUND_REPORT
if not defined REPORT (
    echo No startup report found yet.
    echo Run an optimization with "Startup Analysis" enabled first!
    echo.
    pause
    goto MENU
)

echo Opening: %REPORT%
echo.
start "" "%REPORT%"
goto MENU

:RESTORE
cls
echo.
echo ============================================================
echo          RESTORE PREVIOUS SETTINGS
echo ============================================================
echo.
echo Available restore points:
echo.

:: List all restore scripts with timestamps
setlocal enabledelayedexpansion
set count=0
for /f "tokens=*" %%i in ('dir /b /o-d "RESTORE_Windows_Settings_*.ps1" 2^>nul') do (
    set /a count+=1
    set "restore_!count!=%%i"
    
    :: Extract timestamp from filename
    set "filename=%%i"
    set "timestamp=!filename:~27,19!"
    set "timestamp=!timestamp:_= !"
    
    echo  [!count!] !timestamp!
)

if %count%==0 (
    echo No restore points found.
    echo Run an optimization first to create a backup!
    echo.
    pause
    goto MENU
)

echo.
echo  [B] Back to Main Menu
echo.

set /p restore_choice="Select restore point (1-%count% or B): "

if /i "%restore_choice%"=="B" goto MENU

:: Validate choice
if %restore_choice% LSS 1 goto INVALID_RESTORE
if %restore_choice% GTR %count% goto INVALID_RESTORE

call set "RESTORE_SCRIPT=%%restore_%restore_choice%%%"

echo.
echo ============================================================
echo  RESTORING: !RESTORE_SCRIPT!
echo ============================================================
echo.
echo Running with Administrator privileges...
echo.

:: Run restore script with admin (already elevated from launcher)
powershell -ExecutionPolicy Bypass -NoProfile -Command "& {& '%CD%\!RESTORE_SCRIPT!'}"

echo.
echo ============================================================
echo  RESTORE OPERATION COMPLETE
echo ============================================================
echo.
echo Check the output above for any warnings or errors.
echo.
pause
goto MENU

:INVALID_RESTORE
echo Invalid choice.
timeout /t 2 >nul
goto RESTORE

:EXIT
cls
echo.
echo ============================================================
echo  Thank you for using Windows Optimizer!
echo ============================================================
echo.
timeout /t 2 >nul
exit /b

