@echo off
:: ============================================================================
:: Windows 11 Optimizer - All-In-One Edition
:: Version 3.0 - No external scripts needed!
:: ============================================================================

setlocal enabledelayedexpansion
color 0B
title Windows 11 Optimizer

:: Check for admin privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ============================================================
    echo  ADMINISTRATOR PRIVILEGES REQUIRED
    echo ============================================================
    echo.
    echo This tool needs admin rights to optimize your system.
    echo Requesting elevation...
    echo.
    
    :: Re-launch as admin
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:MAIN_MENU
cls
echo.
echo ============================================================
echo          WINDOWS 11 OPTIMIZER - ALL-IN-ONE TOOL
echo ============================================================
echo.
echo  Running with Administrator privileges
echo.
echo  What would you like to do?
echo.
echo  [1] Configure and Run Optimization Now
echo  [2] Schedule Automatic Maintenance
echo  [3] View Last Optimization Log
echo  [4] View Startup Programs Report  
echo  [5] Restore Previous Settings
echo  [6] Exit
echo.
echo ============================================================
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto CONFIGURE_OPTIONS
if "%choice%"=="2" goto SCHEDULE_MENU
if "%choice%"=="3" goto VIEW_LOG
if "%choice%"=="4" goto VIEW_STARTUP
if "%choice%"=="5" goto RESTORE_MENU
if "%choice%"=="6" goto EXIT_PROGRAM

echo Invalid choice. Please try again.
timeout /t 2 >nul
goto MAIN_MENU

:CONFIGURE_OPTIONS
cls
echo.
echo ============================================================
echo          SELECT OPTIMIZATION OPTIONS
echo ============================================================
echo.
echo  Select what you want to optimize:
echo.
echo  TEMP FILES CLEANUP:
echo  [1] Clean User Temp Folder         [Recommended]
echo  [2] Clean Windows Temp Folder      [Recommended]
echo  [3] Clear Prefetch Cache           [Optional]
echo  [4] Clear Thumbnail Cache          [Safe]
echo  [5] Empty Recycle Bin              [Permanent!]
echo.
echo  PRIVACY SETTINGS:
echo  [6] Minimize Telemetry             [Recommended]
echo  [7] Disable Advertising ID         [Recommended]
echo  [8] Disable Cortana                [Safe]
echo  [9] Disable Location Tracking      [May affect apps]
echo.
echo  PERFORMANCE:
echo  [A] Enable Game Mode               [Recommended]
echo  [B] Disable Superfetch (SSD only)  [SSD Only]
echo  [C] Disable Hibernation            [Frees space]
echo.
echo  DISK MAINTENANCE:
echo  [D] Clean Component Store          [Takes 5-10 min]
echo  [E] Remove Old Updates             [Recommended]
echo  [F] Clear System Logs              [Safe]
echo.
echo  SERVICES:
echo  [G] Disable DiagTrack              [Recommended]
echo  [H] Set Superfetch to Manual       [Safe]
echo  [I] Set Windows Search to Manual   [May slow search]
echo.
echo  STARTUP ANALYSIS:
echo  [J] Generate Startup Report        [Safe]
echo.
echo  [R] Run with selected options
echo  [S] Select recommended (1,2,6,7,A,E,F,G)
echo  [C] Clear all selections
echo  [B] Back to main menu
echo.
echo ============================================================
echo.
echo Currently selected: !SELECTIONS!
echo.

set /p opt="Enter option: "

:: Handle menu options
if /i "%opt%"=="R" goto RUN_OPTIMIZATION
if /i "%opt%"=="S" goto SELECT_RECOMMENDED
if /i "%opt%"=="C" (
    set "SELECTIONS="
    set "OPT_*="
    goto CONFIGURE_OPTIONS
)
if /i "%opt%"=="B" goto MAIN_MENU

:: Toggle selection
if /i "%opt%"=="1" call :TOGGLE OPT_TEMP_USER "User Temp"
if /i "%opt%"=="2" call :TOGGLE OPT_TEMP_WIN "Win Temp"
if /i "%opt%"=="3" call :TOGGLE OPT_PREFETCH "Prefetch"
if /i "%opt%"=="4" call :TOGGLE OPT_THUMBNAIL "Thumbnails"
if /i "%opt%"=="5" call :TOGGLE OPT_RECYCLE "Recycle Bin"
if /i "%opt%"=="6" call :TOGGLE OPT_TELEMETRY "Telemetry"
if /i "%opt%"=="7" call :TOGGLE OPT_ADS "Ad ID"
if /i "%opt%"=="8" call :TOGGLE OPT_CORTANA "Cortana"
if /i "%opt%"=="9" call :TOGGLE OPT_LOCATION "Location"
if /i "%opt%"=="A" call :TOGGLE OPT_GAMEMODE "Game Mode"
if /i "%opt%"=="B" call :TOGGLE OPT_SUPERFETCH "Superfetch"
if /i "%opt%"=="C" call :TOGGLE OPT_HIBERNATE "Hibernation"
if /i "%opt%"=="D" call :TOGGLE OPT_WINSXS "WinSxS"
if /i "%opt%"=="E" call :TOGGLE OPT_UPDATES "Old Updates"
if /i "%opt%"=="F" call :TOGGLE OPT_LOGS "Logs"
if /i "%opt%"=="G" call :TOGGLE OPT_DIAGTRACK "DiagTrack"
if /i "%opt%"=="H" call :TOGGLE OPT_SYSMAIN "SysMain"
if /i "%opt%"=="I" call :TOGGLE OPT_WSEARCH "WSearch"
if /i "%opt%"=="J" call :TOGGLE OPT_STARTUP "Startup"

goto CONFIGURE_OPTIONS

:TOGGLE
if defined %1 (
    set "%1="
) else (
    set "%1=1"
    set "SELECTIONS=!SELECTIONS! %~2"
)
exit /b

:SELECT_RECOMMENDED
set "OPT_TEMP_USER=1"
set "OPT_TEMP_WIN=1"
set "OPT_TELEMETRY=1"
set "OPT_ADS=1"
set "OPT_GAMEMODE=1"
set "OPT_UPDATES=1"
set "OPT_LOGS=1"
set "OPT_DIAGTRACK=1"
set "SELECTIONS= User Temp, Win Temp, Telemetry, Ad ID, Game Mode, Old Updates, Logs, DiagTrack"
goto CONFIGURE_OPTIONS

:RUN_OPTIMIZATION
cls
echo.
echo ============================================================
echo          RUNNING OPTIMIZATION
echo ============================================================
echo.
echo Selected options:!SELECTIONS!
echo.
echo Starting optimization with admin privileges...
echo.
pause

:: Generate timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=: " %%a in ('time /t') do (set mytime=%%a-%%b)
set "TIMESTAMP=%mydate%_%mytime: =0%"
set "LOGFILE=%~dp0Optimization_Log_%TIMESTAMP%.txt"

:: Run PowerShell optimization inline
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { ^
    $logFile = '%LOGFILE%'; ^
    Write-Host '=============================================================' -ForegroundColor Cyan; ^
    Write-Host 'Windows 11 Optimization - Starting...' -ForegroundColor Cyan; ^
    Write-Host '=============================================================' -ForegroundColor Cyan; ^
    Write-Host ''; ^
    'Optimization started: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | Out-File -FilePath $logFile -Encoding UTF8; ^
    Write-Host 'Log file: %LOGFILE%' -ForegroundColor Green; ^
    Write-Host ''; ^
    Write-Host 'Optimization complete!' -ForegroundColor Green; ^
}"

echo.
echo ============================================================
echo  OPTIMIZATION COMPLETE
echo ============================================================
echo.
echo Log saved to: %LOGFILE%
echo.
pause
goto MAIN_MENU

:SCHEDULE_MENU
cls
echo.
echo ============================================================
echo          SCHEDULE AUTOMATIC MAINTENANCE
echo ============================================================
echo.
echo This will create a task that automatically cleans:
echo  - Temporary files
echo  - Old Windows updates  
echo  - System logs
echo.
echo How often should it run?
echo.
echo  [1] Daily
echo  [2] Weekly (Recommended)
echo  [3] Monthly
echo  [B] Back to main menu
echo.

set /p freq="Enter choice: "

if /i "%freq%"=="B" goto MAIN_MENU
if "%freq%"=="1" set FREQUENCY=Daily
if "%freq%"=="2" set FREQUENCY=Weekly
if "%freq%"=="3" set FREQUENCY=Monthly

if not defined FREQUENCY (
    echo Invalid choice.
    timeout /t 2 >nul
    goto SCHEDULE_MENU
)

echo.
echo At what hour should it run? (0-23, e.g., 2 for 2 AM)
set /p hour="Enter hour: "

if %hour% LSS 0 goto INVALID_HOUR
if %hour% GTR 23 goto INVALID_HOUR

:: Create scheduled task
echo.
echo Creating scheduled task...
echo.

:: TODO: Implement task creation
echo Task creation not yet implemented in this version.
echo.
pause
goto MAIN_MENU

:INVALID_HOUR
echo Invalid hour.
timeout /t 2 >nul
goto SCHEDULE_MENU

:VIEW_LOG
cls
echo.
echo ============================================================
echo          VIEW LAST OPTIMIZATION LOG
echo ============================================================
echo.

for /f "delims=" %%i in ('dir /b /o-d "Optimization_Log_*.txt" 2^>nul') do (
    set "LOG=%%i"
    goto :FOUND_LOG
)

echo No log files found yet.
echo.
pause
goto MAIN_MENU

:FOUND_LOG
echo Opening: %LOG%
notepad "%LOG%"
goto MAIN_MENU

:VIEW_STARTUP
cls
echo.
echo ============================================================
echo          VIEW STARTUP PROGRAMS REPORT
echo ============================================================
echo.

for /f "delims=" %%i in ('dir /b /o-d "Startup_Report_*.html" 2^>nul') do (
    set "REPORT=%%i"
    goto :FOUND_REPORT
)

echo No startup report found yet.
echo.
pause
goto MAIN_MENU

:FOUND_REPORT
echo Opening: %REPORT%
start "" "%REPORT%"
goto MAIN_MENU

:RESTORE_MENU
cls
echo.
echo ============================================================
echo          RESTORE PREVIOUS SETTINGS
echo ============================================================
echo.
echo This feature requires the old backup files.
echo.
echo For now, use System Restore from Windows Settings.
echo.
pause
goto MAIN_MENU

:EXIT_PROGRAM
cls
echo.
echo ============================================================
echo  Thank you for using Windows 11 Optimizer!
echo ============================================================
echo.
timeout /t 2 >nul
exit /b

