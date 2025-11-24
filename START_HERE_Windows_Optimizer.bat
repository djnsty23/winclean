@echo off
setlocal EnableDelayedExpansion

:: ============================================
:: Windows 11 Optimizer - Interactive Menu
:: Generated: 11/24/2025, 6:22:33 PM
:: ============================================
:: IMPORTANT: Place the companion PS1 files in the same folder!
:: - Windows_Optimizer_OneTime.ps1
:: - Windows_Optimizer_Scheduled.ps1
:: ============================================

:: Check for admin privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ============================================
    echo  ADMIN PRIVILEGES REQUIRED
    echo ============================================
    echo This script needs administrator privileges.
    echo Please right-click and select "Run as Administrator"
    echo.
    pause
    exit /b 1
)

:: Get the directory where this BAT file is located
set "SCRIPT_DIR=%~dp0"
set "ONETIME_SCRIPT=%SCRIPT_DIR%Windows_Optimizer_OneTime.ps1"
set "SCHEDULED_SCRIPT=%SCRIPT_DIR%Windows_Optimizer_Scheduled.ps1"

:: Check if PS1 files exist
if not exist "%ONETIME_SCRIPT%" (
    echo ERROR: Cannot find Windows_Optimizer_OneTime.ps1
    echo Please ensure all downloaded files are in the same folder.
    pause
    exit /b 1
)

if not exist "%SCHEDULED_SCRIPT%" (
    echo ERROR: Cannot find Windows_Optimizer_Scheduled.ps1
    echo Please ensure all downloaded files are in the same folder.
    pause
    exit /b 1
)

:MENU
cls
echo.
echo ============================================
echo    WINDOWS 11 OPTIMIZER
echo ============================================
echo.
echo Select an option:
echo.
echo  [1] Run Optimization Now
echo      Execute all your selected optimizations
echo.
echo  [2] Schedule Recurring Maintenance
echo      Auto-run cleanup tasks (temp, logs, updates)
echo.
echo  [3] View Last Log
echo  [4] View Startup Report
echo  [5] Restore Previous Settings
echo  [6] Exit
echo.
echo ============================================
echo  Files saved in: %SCRIPT_DIR%
echo ============================================
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto RUN_OPTIMIZATION
if "%choice%"=="2" goto SCHEDULE_MENU
if "%choice%"=="3" goto VIEW_LOG
if "%choice%"=="4" goto VIEW_STARTUP
if "%choice%"=="5" goto RESTORE_MENU
if "%choice%"=="6" goto EXIT
echo Invalid choice. Please try again.
timeout /t 2 >nul
goto MENU

:RUN_OPTIMIZATION
cls
echo.
echo ============================================
echo  RUNNING OPTIMIZATION
echo ============================================
echo.
powershell.exe -ExecutionPolicy Bypass -File "%ONETIME_SCRIPT%"
echo.
echo ============================================
echo  OPTIMIZATION COMPLETE
echo ============================================
echo.
pause
goto MENU

:SCHEDULE_MENU
cls
echo.
echo ============================================
echo  SCHEDULE RECURRING MAINTENANCE
echo ============================================
echo.
echo This will schedule ONLY recurring tasks:
echo  - Temp files cleanup (user, Windows, prefetch, thumbnails)
echo  - Browser cache cleanup (Edge, Chrome, Brave, Opera)
echo  - Old Windows update cleanup
echo  - System logs cleanup
echo  - Component store cleanup (WinSxS, if selected)
echo  - System file repair (DISM+SFC, monthly only)
echo.
echo (Privacy/performance/services settings are one-time only)
echo.
echo Logs will be saved to: %SCRIPT_DIR%
echo.
echo Select frequency:
echo.
echo  [1] Daily
echo  [2] Weekly (every Sunday)
echo  [3] Monthly (1st of each month)
echo  [4] Back to Main Menu
echo.
set /p freq="Enter choice (1-4): "

if "%freq%"=="4" goto MENU
if "%freq%"=="1" set "triggerType=DAILY" & goto SELECT_TIME
if "%freq%"=="2" set "triggerType=WEEKLY" & goto SELECT_TIME
if "%freq%"=="3" set "triggerType=MONTHLY" & goto SELECT_TIME

echo Invalid choice.
timeout /t 2 >nul
goto SCHEDULE_MENU

:SELECT_TIME
cls
echo.
echo ============================================
echo  SELECT TIME
echo ============================================
echo.
echo Enter the hour to run (0-23):
echo  Example: 3 for 3 AM, 14 for 2 PM
echo.
set /p hour="Hour: "

:: Validate hour
set /a testHour=%hour% 2>nul
if %testHour% LSS 0 goto INVALID_HOUR
if %testHour% GTR 23 goto INVALID_HOUR
goto SELECT_VISIBILITY

:INVALID_HOUR
echo Invalid hour. Please enter 0-23.
timeout /t 2 >nul
goto SELECT_TIME

:SELECT_VISIBILITY
cls
echo.
echo ============================================
echo  SELECT TASK VISIBILITY
echo ============================================
echo.
echo How should the task run?
echo.
echo  [1] Hidden (Silent) - No window shown
echo       Recommended for unattended maintenance
echo.
echo  [2] Show Window - Display PowerShell window
echo       Useful for monitoring or troubleshooting
echo.
set /p visibility="Enter choice (1-2): "

if "%visibility%"=="1" set "taskHidden=1" & goto CREATE_TASK
if "%visibility%"=="2" set "taskHidden=0" & goto CREATE_TASK

echo Invalid choice. Please enter 1 or 2.
timeout /t 2 >nul
goto SELECT_VISIBILITY

:CREATE_TASK
cls
echo.
echo Creating scheduled task...
echo.

set "taskName=WindowsOptimizerMaintenance"

:: Set PowerShell argument based on visibility
if "%taskHidden%"=="1" (
    set "psArgs=-WindowStyle Hidden -ExecutionPolicy Bypass -File "%SCHEDULED_SCRIPT%""
    set "visibilityText=Hidden (Silent)"
) else (
    set "psArgs=-ExecutionPolicy Bypass -File "%SCHEDULED_SCRIPT%""
    set "visibilityText=Visible Window"
)

:: Create a temporary PowerShell script to avoid argument escaping issues
set "tempPS=%TEMP%\CreateScheduledTask_%RANDOM%.ps1"

:: Verify the scheduled script exists
if not exist "%SCHEDULED_SCRIPT%" (
    echo ============================================
    echo  ERROR: SCRIPT FILE NOT FOUND
    echo ============================================
    echo.
    echo The scheduled script was not found:
    echo %SCHEDULED_SCRIPT%
    echo.
    echo Please ensure all 3 files are in the same folder:
    echo  - START_HERE_Windows_Optimizer.bat
    echo  - Windows_Optimizer_OneTime.ps1
    echo  - Windows_Optimizer_Scheduled.ps1
    echo.
    pause
    goto MENU
)

:: Build the PowerShell script content
(
echo $ErrorActionPreference = 'Stop'
echo try {
echo     $action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-ExecutionPolicy Bypass -File ""%SCHEDULED_SCRIPT%"""
echo.
if "%triggerType%"=="DAILY" (
echo     $trigger = New-ScheduledTaskTrigger -Daily -At %hour%:00
) else if "%triggerType%"=="WEEKLY" (
echo     $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At %hour%:00
) else (
echo     $trigger = New-ScheduledTaskTrigger -Daily -At %hour%:00
)
echo.
echo     $principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -RunLevel Highest
echo.
if "%taskHidden%"=="1" (
echo     $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 2) -Hidden
) else (
echo     $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 2)
)
echo.
echo     Register-ScheduledTask -TaskName "%taskName%" -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force ^| Out-Null
echo     Write-Host "SUCCESS"
echo     exit 0
echo } catch {
echo     Write-Host "ERROR: $_"
echo     exit 1
echo }
) > "%tempPS%"

:: Execute the PowerShell script and capture output
for /f "delims=" %%i in ('powershell.exe -ExecutionPolicy Bypass -File "%tempPS%" 2^>^&1') do set PS_OUTPUT=%%i

:: Clean up temp file
del "%tempPS%" >nul 2>&1

:: Capture the exit code immediately
set TASK_RESULT=%errorlevel%

:: Verify task was actually created
schtasks /query /tn "%taskName%" >nul 2>&1
if %errorlevel% equ 0 (
    set TASK_EXISTS=1
) else (
    set TASK_EXISTS=0
)

:: Show result based on verification
if "%TASK_EXISTS%"=="1" (
    echo ============================================
    echo  SCHEDULED TASK CREATED SUCCESSFULLY!
    echo ============================================
    echo.
    echo Task Name: %taskName%
    echo Frequency: %triggerType%
    echo Time: %hour%:00
    echo Visibility: %visibilityText%
    echo Run As: %USERDOMAIN%\%USERNAME%
    echo.
    echo Script Location:
    echo %SCHEDULED_SCRIPT%
    echo.
    echo Log Location:
    echo %SCRIPT_DIR%
    echo.
    echo Next Run: Check Task Scheduler for exact time
    echo.
    echo ============================================
    echo  HOW TO MANAGE THIS TASK
    echo ============================================
    echo.
    echo To check, run, or modify:
    echo  1. Press Win+R
    echo  2. Type: taskschd.msc
    echo  3. Find "WindowsOptimizerMaintenance"
    echo  4. Right-click and select "Run" to test now
    echo.
    echo To stop automatic maintenance:
    echo  - Right-click the task in Task Scheduler
    echo  - Select "Disable" (pause) or "Delete" (remove)
    echo.
    echo.
    pause
    goto MENU
)

:: If we get here, task creation failed
echo ============================================
echo  ERROR CREATING TASK
echo ============================================
echo.
echo Failed to create task. Debugging info:
echo  - PowerShell output: %PS_OUTPUT%
echo  - PowerShell exit code: %TASK_RESULT%
echo  - Task exists check: %TASK_EXISTS%
echo  - Trigger type: %triggerType%
echo  - Hour: %hour%
echo  - Hidden: %taskHidden%
echo.
echo Please check Task Scheduler manually:
echo  1. Press Win+R
echo  2. Type: taskschd.msc
echo  3. Look for "WindowsOptimizerMaintenance"
echo.
echo.
pause
goto MENU

:VIEW_LOG
cls
echo.
echo ============================================
echo  VIEWING LAST LOG
echo ============================================
echo.

:: Check script folder first
for /f "delims=" %%f in ('dir "%SCRIPT_DIR%Windows_Optimization_Log_*.txt" /b /o-d 2^>nul') do (
    set "latestLog=%SCRIPT_DIR%%%f"
    goto FOUND_LOG
)

:: Fallback to Desktop
for /f "delims=" %%f in ('dir "%USERPROFILE%\Desktop\Windows_Optimization_Log_*.txt" /b /o-d 2^>nul') do (
    set "latestLog=%USERPROFILE%\Desktop\%%f"
    goto FOUND_LOG
)

echo No log files found.
echo Logs are created after running optimization.
pause
goto MENU

:FOUND_LOG
start notepad.exe "%latestLog%"
timeout /t 1 >nul
goto MENU

:VIEW_STARTUP
cls
echo.
echo ============================================
echo  VIEWING STARTUP REPORT
echo ============================================
echo.

:: Check script folder first
for /f "delims=" %%f in ('dir "%SCRIPT_DIR%StartupPrograms_*.txt" /b /o-d 2^>nul') do (
    set "latestReport=%SCRIPT_DIR%%%f"
    goto FOUND_REPORT
)

:: Fallback to Desktop
for /f "delims=" %%f in ('dir "%USERPROFILE%\Desktop\StartupPrograms_*.txt" /b /o-d 2^>nul') do (
    set "latestReport=%USERPROFILE%\Desktop\%%f"
    goto FOUND_REPORT
)

echo No startup reports found.
echo Reports are created when startup analysis is enabled.
pause
goto MENU

:FOUND_REPORT
start notepad.exe "%latestReport%"
timeout /t 1 >nul
goto MENU

:RESTORE_MENU
cls
echo.
echo ============================================
echo  RESTORE PREVIOUS SETTINGS
echo ============================================
echo.
echo Available restore points:
echo.

set count=0
for /f "delims=" %%f in ('dir "%SCRIPT_DIR%RESTORE_Windows_Settings_*.ps1" /b /o-d 2^>nul') do (
    set /a count+=1
    set "restore!count!=%SCRIPT_DIR%%%f"
    echo  [!count!] %%f
)

if %count% equ 0 (
    echo No restore points found in this folder.
    echo.
    echo Make sure restore scripts are in the same folder as this BAT file.
    pause
    goto MENU
)

echo.
echo  [0] Back to Main Menu
echo.
set /p restoreChoice="Select restore point (0-%count%): "

if "%restoreChoice%"=="0" goto MENU
if %restoreChoice% LSS 1 goto INVALID_RESTORE
if %restoreChoice% GTR %count% goto INVALID_RESTORE

call set "selectedRestore=%%restore%restoreChoice%%%"
echo.
echo Running: %selectedRestore%
powershell.exe -ExecutionPolicy Bypass -File "%selectedRestore%"
pause
goto MENU

:INVALID_RESTORE
echo Invalid selection.
timeout /t 2 >nul
goto RESTORE_MENU

:EXIT
cls
echo.
echo Thank you for using Windows 11 Optimizer!
timeout /t 2 >nul
exit /b 0
