// Windows 11 Optimization Portal - Unified Script Generator
// Version 3.0 - Cross-section script generation

// ============================================
// MODAL & UI FUNCTIONS
// ============================================

function closeModal() {
    document.getElementById('scriptModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('scriptModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.minWidth = '300px';
    notification.style.animation = 'slideIn 0.3s ease-out';
    notification.innerHTML = `<div style="font-size:1.5rem">${type === 'success' ? 'SUCCESS' : type === 'warning' ? 'WARNING' : 'INFO'}</div><div>${message}</div>`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function downloadScript(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('SUCCESS: Script downloaded! Check your Downloads folder.', 'success');
}

function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, 19).replace('T', '_');
}

// ============================================
// MAIN SCRIPT GENERATION FUNCTION
// ============================================

function generateScript() {
    // Check if backup is enabled
    const createBackup = document.getElementById('create-backup')?.checked || false;
    
    // Collect all selected options
    const selected = {
        temp: {
            user: document.getElementById('temp-user')?.checked || false,
            windows: document.getElementById('temp-windows')?.checked || false,
            prefetch: document.getElementById('temp-prefetch')?.checked || false,
            thumbnail: document.getElementById('temp-thumbnail')?.checked || false,
            recycle: document.getElementById('temp-recycle')?.checked || false
        },
        privacy: {
            telemetry: document.getElementById('privacy-telemetry')?.checked || false,
            ads: document.getElementById('privacy-ads')?.checked || false,
            cortana: document.getElementById('privacy-cortana')?.checked || false,
            location: document.getElementById('privacy-location')?.checked || false
        },
        performance: {
            visual: document.getElementById('perf-visual')?.checked || false,
            gamemode: document.getElementById('perf-gamemode')?.checked || false,
            superfetch: document.getElementById('perf-superfetch')?.checked || false,
            hibernation: document.getElementById('perf-hibernation')?.checked || false
        },
        disk: {
            winsxs: document.getElementById('disk-winsxs')?.checked || false,
            updates: document.getElementById('disk-updates')?.checked || false,
            logs: document.getElementById('disk-logs')?.checked || false
        },
        startup: {
            scan: document.getElementById('startup-scan')?.checked || false,
            report: document.getElementById('startup-report')?.checked || false
        },
        services: {
            diagtrack: document.getElementById('service-diagtrack')?.checked || false,
            sysmain: document.getElementById('service-sysmain')?.checked || false,
            wsearch: document.getElementById('service-wsearch')?.checked || false
        }
    };

    // Check if anything is selected
    const hasSelection = Object.values(selected).some(category => 
        Object.values(category).some(value => value === true)
    );

    if (!hasSelection) {
        showNotification('Please select at least one optimization option!', 'warning');
        return;
    }

    // Generate the one-time optimization script (full selections)
    const oneTimeScript = buildPowerShellScript(selected, false, false, createBackup);
    
    // Generate scheduled script (recurring tasks only)
    const scheduledScript = buildScheduledMaintenanceScript(selected);
    
    // Build the unified BAT file
    const batFilename = `Windows_Optimizer.bat`;
    const batScript = buildUnifiedBatFile(oneTimeScript, scheduledScript, selected, createBackup);
    
    // Show modal with download option
    showBatScriptModal(batFilename, batScript, selected);
}

function showBatScriptModal(batFilename, batScript, selected) {
    // Count selected optimizations
    const totalSelected = Object.values(selected).reduce((sum, category) => {
        return sum + Object.values(category).filter(v => v === true).length;
    }, 0);
    
    const modalContent = `
        <div class="alert alert-success">
            <div style="font-size:1.5rem">SUCCESS</div>
            <div><strong>Your Optimizer is Ready!</strong><br>Custom script generated with ${totalSelected} optimizations.</div>
        </div>
        <div class="instructions-box">
            <h4>📦 What You're Getting:</h4>
            <div style="margin: 1rem 0; padding: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <strong style="font-size: 1.1rem;">3 Files (Downloaded Together)</strong><br>
                <small>• Windows_Optimizer.bat - Interactive launcher<br>
                • Windows_Optimizer_OneTime.ps1 - Full optimization<br>
                • Windows_Optimizer_Scheduled.ps1 - Recurring tasks</small>
            </div>
            
            <h4 style="margin-top: 1.5rem;">🚀 How to Use:</h4>
            <ol style="line-height: 1.8;">
                <li><strong>Download all files</strong> (3 files will download automatically)</li>
                <li><strong>Keep all 3 files together</strong> in the same folder</li>
                <li><strong>Right-click Windows_Optimizer.bat</strong> → <strong>Run as Administrator</strong></li>
                <li><strong>Choose from the menu:</strong>
                    <ul style="margin-top: 0.5rem;">
                        <li>[1] Run optimization now</li>
                        <li>[2] Schedule recurring maintenance</li>
                        <li>[3] View logs</li>
                        <li>[4] View startup report</li>
                        <li>[5] Restore previous settings</li>
                    </ul>
                </li>
            </ol>
            
            <div style="margin-top: 1rem; padding: 1rem; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px;">
                <strong>⚠️ IMPORTANT:</strong> All 3 files must be in the same folder to work!
            </div>
        </div>
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <button class="btn btn-generate" style="flex: 1;" onclick="downloadAllOptimizerFiles()">
                📥 Download All Files
            </button>
            <button class="btn btn-preview" onclick="closeModal()">
                Cancel
            </button>
        </div>
    `;
    
    showModal('Optimizer Ready', modalContent);
    window.batScriptData = { filename: batFilename, content: batScript };
}

function downloadAllOptimizerFiles() {
    // Download BAT file
    downloadScript(window.batScriptData.filename, window.batScriptData.content);
    
    // Download OneTime PS1 file
    setTimeout(() => {
        downloadScript('Windows_Optimizer_OneTime.ps1', window.oneTimePowerShellScript);
    }, 300);
    
    // Download Scheduled PS1 file
    setTimeout(() => {
        downloadScript('Windows_Optimizer_Scheduled.ps1', window.scheduledPowerShellScript);
    }, 600);
    
    closeModal();
    showNotification('All files downloaded! Keep them together and run the BAT file as Admin.', 'success');
}

function downloadPreviewScript() {
    const filename = `Windows_Optimizer_PREVIEW_${getTimestamp()}.ps1`;
    downloadScript(filename, window.currentScript);
    closeModal();
}

function downloadScheduledScript() {
    const filename = `Windows_Optimizer_SCHEDULED_${getTimestamp()}.ps1`;
    closeModal();
    showInstructionsModal(filename, window.currentScript, 'schedule');
}

function showInstructionsModal(filename, scriptContent, type) {
    let instructions = '';
    
    if (type === 'optimize') {
        instructions = `
            <div class="instructions-box">
                <h4>[BACKUP] How to Run Your Optimization Script</h4>
                <ol>
                    <li><strong>Download the script</strong> by clicking the button below</li>
                    <li><strong>Locate the file</strong> in your Downloads folder (<code>${filename}</code>)</li>
                    <li><strong>[SECURE] UNBLOCK THE FILE (Important!):</strong>
                        <ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
                            <li>Right-click the .ps1 file → <strong>Properties</strong></li>
                            <li>At the bottom, check <strong>☑ Unblock</strong></li>
                            <li>Click <strong>OK</strong></li>
                        </ul>
                    </li>
                    <li><strong>Now right-click the file</strong> → Select <strong>"Run with PowerShell"</strong> (or "Run as Administrator")</li>
                    <li>A black window will appear - <strong>WAIT for it to complete</strong></li>
                    <li><strong>Notepad opens automatically</strong> with a complete log of what happened</li>
                </ol>
                <div style="margin-top: 1rem; padding: 1rem; background: #e8f5e9; border-radius: 6px; border-left: 4px solid #4caf50;">
                    <strong>SUCCESS: Why Unblock?</strong><br>
                    This tells Windows you trust THIS specific file. It's MORE SECURE than changing your PowerShell execution policy globally!
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: #fff4e6; border-radius: 6px; border-left: 4px solid var(--warning);">
                    <strong>WARNING Alternative: One-Time Bypass (Also Secure)</strong><br>
                    If you prefer NOT to unblock, open PowerShell as Admin and run:<br>
                    <code style="background: rgba(0,0,0,0.1); padding: 0.3rem; border-radius: 3px; display: block; margin-top: 0.5rem;">powershell -ExecutionPolicy Bypass -File "C:\\Downloads\\${filename}"</code>
                    This only bypasses policy for THIS ONE execution (secure!).
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: #e6f3ff; border-radius: 6px;">
                    <strong>[TIP] What to expect:</strong> A log file will appear on your <strong>Desktop</strong> showing everything that happened. 
                    If backup was enabled, you'll also see <strong>RESTORE script</strong> and <strong>backup JSON file</strong>.
                </div>
            </div>
        `;
    } else if (type === 'schedule') {
        instructions = `
            <div class="instructions-box">
                <h4>[BACKUP] How to Set Up Scheduled Maintenance</h4>
                <ol>
                    <li><strong>Download the script</strong> by clicking the button below</li>
                    <li><strong>Locate the file</strong> in your Downloads folder (<code>${filename}</code>)</li>
                    <li><strong>Right-click the file</strong> → Select <strong>"Run with PowerShell"</strong></li>
                    <li>Click <strong>"Yes"</strong> when prompted for administrator access</li>
                    <li>The script will create a <strong>weekly task</strong> that runs every Sunday at 2 AM</li>
                    <li>To manage it later, press <strong>Win+R</strong>, type <code>taskschd.msc</code>, and look for <strong>"Windows Weekly Optimization"</strong></li>
                </ol>
                <div style="margin-top: 1rem; padding: 1rem; background: #e6f9e6; border-radius: 6px;">
                    <strong>SUCCESS: What it does:</strong> Creates a scheduled task that automatically runs your selected optimizations every week. 
                    You can disable or delete it anytime from Task Scheduler.
                </div>
            </div>
        `;
    }
    
    const modalContent = `
        <div class="alert alert-success">
            <div style="font-size:1.5rem">SUCCESS</div>
            <div><strong>Script Ready!</strong><br>Your PowerShell script has been generated and is ready to download.</div>
        </div>
        ${instructions}
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <button class="btn btn-generate" style="flex: 1;" onclick="downloadScriptAndClose('${filename}')">
                📥 Download Script
            </button>
            <button class="btn btn-preview" onclick="closeModal()">
                Cancel
            </button>
        </div>
    `;
    
    showModal('Ready to Download', modalContent);
    window.currentScriptToDownload = scriptContent;
    window.currentFilename = filename;
}

function downloadScriptAndClose(filename) {
    downloadScript(filename || window.currentFilename, window.currentScriptToDownload);
    closeModal();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// UNIFIED BAT FILE BUILDER
// ============================================

function buildUnifiedBatFile(oneTimeScript, scheduledScript, selected, createBackup) {
    // Instead of embedding, we'll create companion PS1 files
    // This makes the BAT file cleaner and avoids encoding issues
    
    // Store the scripts for later download
    window.oneTimePowerShellScript = oneTimeScript;
    window.scheduledPowerShellScript = scheduledScript;
    
    const batScript = `@echo off
setlocal EnableDelayedExpansion

:: ============================================
:: Windows 11 Optimizer - Interactive Menu
:: Generated: ${new Date().toLocaleString()}
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
echo  [2] Schedule Recurring Maintenance
echo  [3] View Last Log
echo  [4] View Startup Report
echo  [5] Restore Previous Settings
echo  [6] Exit
echo.
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
goto CREATE_TASK

:INVALID_HOUR
echo Invalid hour. Please enter 0-23.
timeout /t 2 >nul
goto SELECT_TIME

:CREATE_TASK
cls
echo.
echo Creating scheduled task...
echo.

set "taskName=WindowsOptimizerMaintenance"

if "%triggerType%"=="DAILY" (
    powershell.exe -ExecutionPolicy Bypass -Command "$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-ExecutionPolicy Bypass -File \"%SCHEDULED_SCRIPT%\"'; $trigger = New-ScheduledTaskTrigger -Daily -At %hour%:00; $principal = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -LogonType ServiceAccount -RunLevel Highest; $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable; Register-ScheduledTask -TaskName '%taskName%' -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force" >nul 2>&1
)

if "%triggerType%"=="WEEKLY" (
    powershell.exe -ExecutionPolicy Bypass -Command "$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-ExecutionPolicy Bypass -File \"%SCHEDULED_SCRIPT%\"'; $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At %hour%:00; $principal = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -LogonType ServiceAccount -RunLevel Highest; $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable; Register-ScheduledTask -TaskName '%taskName%' -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force" >nul 2>&1
)

if "%triggerType%"=="MONTHLY" (
    powershell.exe -ExecutionPolicy Bypass -Command "$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-ExecutionPolicy Bypass -File \"%SCHEDULED_SCRIPT%\"'; $day = 1; $trigger = New-ScheduledTaskTrigger -Daily -At %hour%:00; $trigger.DaysInterval = 30; $principal = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -LogonType ServiceAccount -RunLevel Highest; $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable; Register-ScheduledTask -TaskName '%taskName%' -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force" >nul 2>&1
)

if %errorlevel% equ 0 (
    echo ============================================
    echo  SUCCESS
    echo ============================================
    echo.
    echo Task: %taskName%
    echo Frequency: %triggerType%
    echo Time: %hour%:00
    echo Script: %SCHEDULED_SCRIPT%
    echo.
    echo Your PC will now be automatically maintained!
) else (
    echo ============================================
    echo  ERROR
    echo ============================================
    echo Failed to create task. Check Task Scheduler.
)

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

for /f "delims=" %%f in ('dir "%USERPROFILE%\\Desktop\\WinOptimizer_*.log" /b /o-d 2^>nul') do (
    set "latestLog=%USERPROFILE%\\Desktop\\%%f"
    goto FOUND_LOG
)

echo No log files found on Desktop.
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

for /f "delims=" %%f in ('dir "%USERPROFILE%\\Desktop\\StartupPrograms_*.txt" /b /o-d 2^>nul') do (
    set "latestReport=%USERPROFILE%\\Desktop\\%%f"
    goto FOUND_REPORT
)

echo No startup reports found.
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
for /f "delims=" %%f in ('dir "%USERPROFILE%\\Desktop\\RESTORE_Windows_Settings_*.ps1" /b /o-d 2^>nul') do (
    set /a count+=1
    set "restore!count!=%USERPROFILE%\\Desktop\\%%f"
    echo  [!count!] %%f
)

if %count% equ 0 (
    echo No restore points found on Desktop.
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
`;

    return batScript;
}

// ============================================
// POWERSHELL SCRIPT BUILDER
// ============================================

function buildPowerShellScript(selected, previewMode, scheduleMode, createBackup = false) {
    const mode = previewMode ? 'PREVIEW' : 'OPTIMIZATION';
    const whatIf = previewMode ? '-WhatIf' : '';
    
    let script = `# ============================================
# Windows 11 ${mode} Script  
# Generated: ${new Date().toLocaleString()}
# ============================================
# HOW TO RUN:
#   1. Right-click this file
#   2. Select "Run with PowerShell"
#   3. If it closes instantly, select "Run as Administrator" instead
# ============================================

# FORCE WINDOW TO STAY OPEN ON ERROR
$ErrorActionPreference = "Continue"
$Host.UI.RawUI.WindowTitle = "Windows Optimization Script - ${mode} Mode"

# Wrap ENTIRE script in try-catch to capture ALL errors
try {

# CREATE LOG FILE FIRST (before anything can fail)
# Save in same folder as script (not Desktop, which may be protected)
$logFile = "$PSScriptRoot\\Windows_Optimization_Log_$(Get-Date -Format "yyyy-MM-dd_HH-mm-ss").txt"

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "  Windows 11 Optimization Script - ${mode} Mode" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Creating log file..." -ForegroundColor Cyan

try {
    "=============================================================" | Out-File -FilePath $logFile -Encoding UTF8 -Force
    "Windows 11 Optimization Script - ${mode} MODE" | Add-Content -Path $logFile
    $startTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "Started: $startTime" | Add-Content -Path $logFile
    "Log file: $logFile" | Add-Content -Path $logFile
    "=============================================================" | Add-Content -Path $logFile
    "" | Add-Content -Path $logFile
    Write-Host "OK: Log file created at: $logFile" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "ERROR: ERROR: Could not create log file!" -ForegroundColor Red
    Write-Host "   Location: $logFile" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Script will continue but won't be logged..." -ForegroundColor Yellow
    Write-Host ""
    Start-Sleep -Seconds 3
}

# Define logging function
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
    try {
        Add-Content -Path $logFile -Value $Message -ErrorAction SilentlyContinue
    } catch {
        # Silently ignore logging errors
    }
}

Write-Log ""
Write-Log "=============================================================" "Cyan"
Write-Log "           WINDOWS 11 ${mode} SCRIPT                    " "Cyan"
Write-Log "=============================================================" "Cyan"
Write-Log ""

# Check admin privileges
try {
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if (-not $isAdmin) {
        Write-Log "WARNING: WARNING: Not running as Administrator" "Yellow"
        Write-Log "   Some operations may fail without admin rights." "Yellow"
        Write-Log "   To fix: Close this, right-click script -> 'Run as Administrator'" "Gray"
        Write-Log ""
        Write-Log "Continuing in 5 seconds..." "Yellow"
        Start-Sleep -Seconds 5
    } else {
        Write-Log "SUCCESS: Running with Administrator privileges" "Green"
    }
} catch {
    Write-Log "WARNING: Could not verify admin status" "Yellow"
}
Write-Log ""

`;

    if (!previewMode && createBackup) {
        script += generateBackupSection(selected);
    } else if (!previewMode) {
        script += `
# Create System Restore Point
Write-Log "[RESTORE] Creating System Restore Point..." "Yellow"
try {
    Enable-ComputerRestore -Drive "C:\\"
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    Checkpoint-Computer -Description "Before Optimization - $timestamp" -RestorePointType "MODIFY_SETTINGS"
    Write-Log "   OK: Restore point created successfully!" "Green"
} catch {
    Write-Log "   WARNING: Could not create restore point: $($_.Exception.Message)" "Yellow"
    Write-Log "   Continuing anyway..." "Gray"
}
Write-Log ""

`;
    }

    script += `# Initialize counters
$totalCleaned = 0
$itemsCleaned = 0
$errorCount = 0

`;

    // TEMP FILES SECTION
    if (Object.values(selected.temp).some(v => v)) {
        script += generateTempCleanupSection(selected.temp, whatIf);
    }

    // PRIVACY SECTION
    if (Object.values(selected.privacy).some(v => v)) {
        script += generatePrivacySection(selected.privacy, whatIf);
    }

    // PERFORMANCE SECTION
    if (Object.values(selected.performance).some(v => v)) {
        script += generatePerformanceSection(selected.performance, whatIf);
    }

    // SERVICES SECTION
    if (Object.values(selected.services).some(v => v)) {
        script += generateServicesSection(selected.services, whatIf);
    }

    // DISK CLEANUP SECTION
    if (Object.values(selected.disk).some(v => v)) {
        script += generateDiskCleanupSection(selected.disk, whatIf);
    }

    // STARTUP ANALYSIS SECTION
    if (Object.values(selected.startup).some(v => v)) {
        script += generateStartupSection(selected.startup);
    }

    // Summary
    script += `
Write-Log ""
Write-Log "=============================================================" "Green"
Write-Log "                  ${mode} COMPLETE!                     " "Green"
Write-Log "=============================================================" "Green"
Write-Log ""
Write-Log "[STATS] FINAL SUMMARY:" "Cyan"
Write-Log ""
Write-Log "   SUCCESS: Items processed: $itemsCleaned" "Green"
Write-Log "   [DISK] Space freed: $([math]::Round($totalCleaned / 1MB, 2)) MB" "Green"
if ($errorCount -gt 0) {
    Write-Log "   WARNING: Items skipped (files in use): $errorCount" "Yellow"
}
Write-Log ""
Write-Log "-------------------------------------------------------------" "Gray"
Write-Log ""
Write-Log "SUCCESS: SUCCESS! Your system has been optimized!" "Green"
Write-Log ""
Write-Log "[FILE] Full log saved to: $logFile" "Cyan"
Write-Log ""
Write-Log "-------------------------------------------------------------" "Gray"
Write-Log ""
$completeTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Log "Script completed at $completeTime" "Gray"
Write-Log ""

# Open log file automatically
Write-Log "Opening log file..." "Cyan"
Start-Process notepad.exe $logFile

Write-Log ""
Write-Log "Opening log file in Notepad..." "Cyan"
try {
    Start-Process notepad.exe $logFile
    Write-Log "SUCCESS: Log file opened" "Green"
} catch {
    Write-Log "WARNING: Could not open log file automatically" "Yellow"
    Write-Log "   You can find it at: $logFile" "Gray"
}

Write-Log ""
Write-Log "=============================================================" "Cyan"
Write-Log "Script completed. Window will stay open." "Cyan"
Write-Log "=============================================================" "Cyan"
Write-Host ""

} catch {
    # CRITICAL ERROR HANDLER - Shows ALL errors before closing
    Write-Host ""
    Write-Host "=============================================================" -ForegroundColor Red
    Write-Host "                   CRITICAL ERROR!                         " -ForegroundColor Red
    Write-Host "=============================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "The script encountered a fatal error:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ERROR MESSAGE:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor White
    Write-Host ""
    Write-Host "ERROR LOCATION:" -ForegroundColor Red
    Write-Host $_.InvocationInfo.PositionMessage -ForegroundColor White
    Write-Host ""
    Write-Host "FULL ERROR DETAILS:" -ForegroundColor Red
    Write-Host ($_ | Format-List * -Force | Out-String) -ForegroundColor Gray
    Write-Host ""
    Write-Host "=============================================================" -ForegroundColor Red
    Write-Host ""
    
    # Try to save error to same folder as script
    try {
        $errorFile = "$PSScriptRoot\\Windows_Optimization_ERROR_$(Get-Date -Format "yyyy-MM-dd_HH-mm-ss").txt"
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        @"
WINDOWS OPTIMIZATION SCRIPT ERROR LOG
Generated: $timestamp

ERROR MESSAGE:
$($_.Exception.Message)

ERROR LOCATION:
$($_.InvocationInfo.PositionMessage)

FULL ERROR DETAILS:
$($_ | Format-List * -Force | Out-String)

STACK TRACE:
$($_.ScriptStackTrace)
"@ | Out-File -FilePath $errorFile -Encoding UTF8
        Write-Host "SUCCESS: Error details saved to: $errorFile" -ForegroundColor Green
        Start-Process notepad.exe $errorFile
    } catch {
        Write-Host "WARNING: Could not save error log to file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
`;

    return script;
}

// ============================================
// BACKUP & RESTORE SYSTEM
// ============================================

function generateBackupSection(selected) {
    return `
# ============================================
# BACKUP CURRENT STATE
# ============================================

Write-Log "=============================================================" "Cyan"
Write-Log "                  BACKING UP CURRENT STATE                 " "Cyan"
Write-Log "=============================================================" "Cyan"
Write-Log ""

$backupTimestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupPath = "$PSScriptRoot\\Windows_Optimization_Backup_$backupTimestamp.json"
$restoreScriptPath = "$PSScriptRoot\\RESTORE_Windows_Settings_$backupTimestamp.ps1"

Write-Log "[DISK] Creating backup of current settings..." "Cyan"

$backup = @{
    Timestamp = $backupTimestamp
    ComputerName = $env:COMPUTERNAME
    UserName = $env:USERNAME
    Registry = @{}
    Services = @{}
    SystemSettings = @{}
}

# Backup Registry Settings
Write-Log "   [BACKUP] Backing up registry settings..." "Gray"

$regPaths = @(
    @{Path="HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection"; Name="AllowTelemetry"},
    @{Path="HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo"; Name="Enabled"},
    @{Path="HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search"; Name="AllowCortana"},
    @{Path="HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location"; Name="Value"},
    @{Path="HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects"; Name="VisualFXSetting"},
    @{Path="HKCU:\\Software\\Microsoft\\GameBar"; Name="AutoGameModeEnabled"}
)

foreach ($reg in $regPaths) {
    try {
        if (Test-Path $reg.Path) {
            $value = Get-ItemProperty -Path $reg.Path -Name $reg.Name -ErrorAction SilentlyContinue
            if ($value -and $null -ne $value.$($reg.Name)) {
                $key = "$($reg.Path)\\$($reg.Name)"
                $backup.Registry[$key] = @{
                    Value = $value.$($reg.Name)
                    Type = $value.$($reg.Name).GetType().Name
                }
            }
        }
    }
    catch {
        # Path doesn't exist, skip
    }
}

# Backup Service States
Write-Log "   [SERVICE] Backing up service states..." "Gray"

$services = @("DiagTrack", "SysMain", "WSearch", "dmwappushservice", "MapsBroker", "XblAuthManager", "XblGameSave", "XboxGipSvc", "XboxNetApiSvc", "Spooler", "Fax")

foreach ($serviceName in $services) {
    try {
        $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
        if ($service) {
            $backup.Services[$serviceName] = @{
                StartType = (Get-Service -Name $serviceName | Select-Object -ExpandProperty StartType).ToString()
                Status = $service.Status.ToString()
            }
        }
    }
    catch {
        # Service doesn't exist, skip
    }
}

# Backup Hibernation State
try {
    $powerCfg = powercfg /a 2>&1
    $backup.SystemSettings["HibernationEnabled"] = $powerCfg -match "Hibernate"
} catch {
    $backup.SystemSettings["HibernationEnabled"] = $false
}

# Save backup to JSON
try {
    $backup | ConvertTo-Json -Depth 10 | Out-File -FilePath $backupPath -Encoding UTF8
    Write-Log "   OK: Backup saved to: $backupPath" "Green"
    
    # Verify backup was created
    if (Test-Path $backupPath) {
        $backupSize = (Get-Item $backupPath).Length
        Write-Log "   OK: Backup file size: $([math]::Round($backupSize / 1KB, 2)) KB" "Green"
    } else {
        Write-Log "   WARNING: Warning: Backup file not found!" "Yellow"
    }
} catch {
    Write-Log "   ERROR: Failed to create backup: $($_.Exception.Message)" "Red"
}

# Generate Restore Script
Write-Log "   [LOG] Generating restore script..." "Gray"

$restoreScript = @'
# ============================================
# RESTORE Windows Settings
# Backup created: TIMESTAMP_PLACEHOLDER
# ============================================
# NOTE: Run via Windows_Optimizer_Launcher.bat for automatic admin elevation
# ============================================

# Define Write-Log function FIRST
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

Write-Log ""
Write-Log "=============================================================" "Magenta"
Write-Log "           RESTORING WINDOWS SETTINGS                      " "Magenta"
Write-Log "=============================================================" "Magenta"
Write-Log ""

$backupFile = "BACKUP_PATH_PLACEHOLDER"

if (-not (Test-Path $backupFile)) {
    Write-Log "ERROR: ERROR: Backup file not found: $backupFile" "Red"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Log "Loading backup from: $backupFile" "Cyan"
$backup = Get-Content $backupFile | ConvertFrom-Json

Write-Log "   [INFO] Backup created: $($backup.Timestamp)" "Gray"
Write-Log "   [INFO] Computer: $($backup.ComputerName)" "Gray"
Write-Log ""

$restored = 0
$errors = 0

# Check if running as Administrator
Write-Log "[CHECK] Checking admin privileges..." "Cyan"
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Log ""
    Write-Log "WARNING: Not running as Administrator!" "Yellow"
    Write-Log "Some settings may fail to restore without admin rights." "Yellow"
    Write-Log ""
    Write-Log "Press any key to continue anyway..." "Gray"
    $null = Read-Host
}
Write-Log ""

# Restore Registry Settings
Write-Log "[BACKUP] Restoring registry settings..." "Yellow"
foreach ($key in $backup.Registry.PSObject.Properties) {
    $fullPath = $key.Name
    $parts = $fullPath -split '\\\\'
    $valueName = $parts[-1]
    $regPath = $parts[0..($parts.Length-2)] -join '\\'
    
    try {
        if (-not (Test-Path $regPath)) {
            New-Item -Path $regPath -Force -ErrorAction Stop | Out-Null
        }
        $valueData = if ($key.Value.Value) { $key.Value.Value } else { $key.Value }
        Set-ItemProperty -Path $regPath -Name $valueName -Value $valueData -ErrorAction Stop
        Write-Log "   OK: Restored: $fullPath" "Green"
        $restored++
    } catch {
        Write-Log "   WARNING: Skipped: $fullPath - $($_.Exception.Message)" "Yellow"
        $errors++
    }
}

# Restore Services
Write-Log ""
Write-Log "[SERVICE] Restoring service states..." "Yellow"
foreach ($svc in $backup.Services.PSObject.Properties) {
    try {
        $service = Get-Service -Name $svc.Name -ErrorAction SilentlyContinue
        if ($null -eq $service) {
            Write-Log "   SKIP: Service not found: $($svc.Name)" "Gray"
            continue
        }
        
        $startType = $svc.Value.StartType
        Set-Service -Name $svc.Name -StartupType $startType -ErrorAction Stop
        Write-Log "   OK: Restored service: $($svc.Name) -> $startType" "Green"
        $restored++
    } catch {
        Write-Log "   WARNING: Could not restore service: $($svc.Name) - $($_.Exception.Message)" "Yellow"
        $errors++
    }
}

# Restore Hibernation
Write-Log ""
if ($backup.SystemSettings.HibernationEnabled -eq $true) {
    Write-Log "[POWER] Re-enabling hibernation..." "Yellow"
    try {
        powercfg -h on
        Write-Log "   OK: Hibernation enabled" "Green"
        $restored++
    } catch {
        Write-Log "   ERROR: Could not enable hibernation" "Red"
        $errors++
    }
}

Write-Log ""
Write-Log "=============================================================" "Green"
Write-Log "                 RESTORE COMPLETE!                         " "Green"
Write-Log "=============================================================" "Green"
Write-Log ""
Write-Log "[STATS] Summary:" "Cyan"
Write-Log "   - Settings restored: $restored" "White"
Write-Log "   - Errors: $errors" "White"
Write-Log ""
Write-Log "SUCCESS: Your settings have been restored to their previous state!" "Green"
Write-Log ""
Read-Host "Press Enter to exit"
'@

# Replace placeholders
$restoreScript = $restoreScript -replace 'TIMESTAMP_PLACEHOLDER', $backupTimestamp
$restoreScript = $restoreScript -replace 'BACKUP_PATH_PLACEHOLDER', $backupPath

try {
    $restoreScript | Out-File -FilePath $restoreScriptPath -Encoding UTF8
    
    # Verify restore script was created
    if (Test-Path $restoreScriptPath) {
        Write-Log "   OK: Restore script created: $restoreScriptPath" "Green"
        $restoreSize = (Get-Item $restoreScriptPath).Length
        Write-Log "   OK: Restore script size: $([math]::Round($restoreSize / 1KB, 2)) KB" "Green"
    } else {
        Write-Log "   WARNING: Warning: Restore script not found!" "Yellow"
    }
} catch {
    Write-Log "   ERROR: Failed to create restore script: $($_.Exception.Message)" "Red"
}

Write-Log ""
Write-Log "=============================================================" "Green"
Write-Log "  SUCCESS: BACKUP COMPLETE - Safe to proceed with optimization   " "Green"
Write-Log "=============================================================" "Green"
Write-Log ""
Write-Log "[FILES] Files saved in script folder:" "Cyan"
Write-Log "   - Backup: Windows_Optimization_Backup_$backupTimestamp.json" "White"
Write-Log "   - Restore: RESTORE_Windows_Settings_$backupTimestamp.ps1" "White"
Write-Log "   - Location: $PSScriptRoot" "Gray"
Write-Log ""
Write-Log "[TIP] To undo changes later, right-click the RESTORE script -> 'Run with PowerShell'" "Yellow"
Write-Log ""
Write-Log "-------------------------------------------------------------" "Gray"
Write-Log ""

`;
}

// ============================================
// SECTION GENERATORS
// ============================================

function generateTempCleanupSection(temp, whatIf) {
    let section = `
Write-Log "=============================================================" "Yellow"
Write-Log "                  TEMP FILES CLEANUP                       " "Yellow"
Write-Log "=============================================================" "Yellow"
Write-Log ""

function Clean-Directory {
    param([string]$Path, [string]$Description)
    
    if (-not (Test-Path $Path)) {
        Write-Log "   SKIPPED: Skipping $Description - Path not found" "Gray"
        return
    }
    
    Write-Log "   [SCAN] Scanning $Description..." "Cyan"
    $sizeBefore = 0
    $filesRemoved = 0
    $filesSkipped = 0
    
    try {
        $items = Get-ChildItem -Path $Path -Recurse -Force -ErrorAction SilentlyContinue
        $itemCount = ($items | Measure-Object).Count
        $sizeBefore = ($items | Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
        $sizeInMB = [math]::Round($sizeBefore / 1MB, 2)
        
        Write-Log "   Found $itemCount items - $sizeInMB MB" "Gray"
        
        foreach ($item in $items) {
            try {
                Remove-Item $item.FullName -Force -Recurse ${whatIf} -ErrorAction Stop
                $filesRemoved++
            } catch {
                $filesSkipped++
            }
        }
        
        $script:totalCleaned += $sizeBefore
        $script:itemsCleaned += $filesRemoved
        
        if ($filesRemoved -gt 0) {
            Write-Log "   SUCCESS: Cleaned $filesRemoved items - $sizeInMB MB" "Green"
        }
        if ($filesSkipped -gt 0) {
            Write-Log "   SKIPPED: Skipped: $filesSkipped items (in use)" "Yellow"
        }
        
    } catch {
        Write-Log "   WARNING: Some files were in use (this is normal)" "Yellow"
        $script:errorCount++
    }
    Write-Log ""
}

`;

    if (temp.user) {
        section += `Clean-Directory -Path $env:TEMP -Description "User Temp Folder (%TEMP%)"
`;
    }

    if (temp.windows) {
        section += `Clean-Directory -Path "C:\\Windows\\Temp" -Description "Windows Temp Folder"
`;
    }

    if (temp.prefetch) {
        section += `Clean-Directory -Path "C:\\Windows\\Prefetch" -Description "Prefetch Cache"
`;
    }

    if (temp.thumbnail) {
        section += `Clean-Directory -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer" -Description "Thumbnail Cache"
`;
    }

    if (temp.recycle) {
        section += `
Write-Log "[DELETE] Emptying Recycle Bin..." "Cyan"
try {
    Clear-RecycleBin -Force ${whatIf} -ErrorAction Stop
    Write-Log "   OK: Recycle Bin emptied" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not empty recycle bin: $($_.Exception.Message)" "Yellow"
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generatePrivacySection(privacy, whatIf) {
    let section = `
Write-Log "=============================================================" "Magenta"
Write-Log "                  PRIVACY SETTINGS                         " "Magenta"
Write-Log "=============================================================" "Magenta"
Write-Log ""

`;

    if (privacy.telemetry) {
        section += `
Write-Log "[SECURE] Minimizing Telemetry..." "Cyan"
try {
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -Value 0 ${whatIf} -ErrorAction Stop
    Write-Log "   OK: Telemetry set to minimum" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not modify telemetry settings" "Yellow"
    $script:errorCount++
}
`;
    }

    if (privacy.ads) {
        section += `
Write-Log "[SECURE] Disabling Advertising ID..." "Cyan"
try {
    if (-not (Test-Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo")) {
        New-Item -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Force ${whatIf} | Out-Null
    }
    Set-ItemProperty -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Name "Enabled" -Value 0 ${whatIf} -ErrorAction Stop
    Write-Log "   OK: Advertising ID disabled" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not disable advertising ID" "Yellow"
    $script:errorCount++
}
`;
    }

    if (privacy.cortana) {
        section += `
Write-Log "[SECURE] Disabling Cortana..." "Cyan"
try {
    if (-not (Test-Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search")) {
        New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Force ${whatIf} | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Name "AllowCortana" -Value 0 ${whatIf} -ErrorAction Stop
    Write-Log "   OK: Cortana disabled" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not disable Cortana" "Yellow"
    $script:errorCount++
}
`;
    }

    if (privacy.location) {
        section += `
Write-Log "[SECURE] Disabling Location Tracking..." "Cyan"
try {
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" -Name "Value" -Value "Deny" ${whatIf} -ErrorAction Stop
    Write-Log "   OK: Location tracking disabled" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not disable location tracking" "Yellow"
    $script:errorCount++
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generatePerformanceSection(perf, whatIf) {
    let section = `
Write-Log "=============================================================" "Blue"
Write-Log "                 PERFORMANCE TUNING                        " "Blue"
Write-Log "=============================================================" "Blue"
Write-Log ""

`;

    if (perf.visual) {
        section += `
Write-Log "[TARGET] Optimizing Visual Effects..." "Cyan"
try {
    Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" -Name "VisualFXSetting" -Value 2 ${whatIf} -ErrorAction Stop
    Write-Log "   OK: Visual effects set to best performance" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not modify visual effects" "Yellow"
    $script:errorCount++
}
`;
    }

    if (perf.gamemode) {
        section += `
Write-Log "[TARGET] Enabling Game Mode..." "Cyan"
try {
    if (-not (Test-Path "HKCU:\\Software\\Microsoft\\GameBar")) {
        New-Item -Path "HKCU:\\Software\\Microsoft\\GameBar" -Force ${whatIf} | Out-Null
    }
    Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AutoGameModeEnabled" -Value 1 ${whatIf} -ErrorAction Stop
    Write-Log "   OK: Game Mode enabled" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not enable Game Mode" "Yellow"
    $script:errorCount++
}
`;
    }

    if (perf.superfetch) {
        section += `
Write-Log "[TARGET] Disabling Superfetch (for SSD)..." "Cyan"
try {
    Set-Service -Name "SysMain" -StartupType Disabled ${whatIf} -ErrorAction Stop
    Stop-Service -Name "SysMain" -Force ${whatIf} -ErrorAction SilentlyContinue
    Write-Log "   OK: Superfetch disabled" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not disable Superfetch" "Yellow"
    $script:errorCount++
}
`;
    }

    if (perf.hibernation) {
        section += `
Write-Log "[TARGET] Disabling Hibernation..." "Cyan"
try {
    powercfg -h off
    Write-Log "   OK: Hibernation disabled (hiberfil.sys deleted)" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not disable hibernation" "Yellow"
    $script:errorCount++
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generateServicesSection(services, whatIf) {
    let section = `
Write-Log "=============================================================" "DarkYellow"
Write-Log "                  WINDOWS SERVICES                         " "DarkYellow"
Write-Log "=============================================================" "DarkYellow"
Write-Log ""

`;

    if (services.diagtrack) {
        section += `
Write-Log "[SERVICE] Disabling Diagnostics Tracking Service..." "Cyan"
try {
    Set-Service -Name "DiagTrack" -StartupType Disabled ${whatIf} -ErrorAction Stop
    Stop-Service -Name "DiagTrack" -Force ${whatIf} -ErrorAction SilentlyContinue
    Write-Log "   OK: DiagTrack service disabled" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not modify DiagTrack service" "Yellow"
    $script:errorCount++
}
`;
    }

    if (services.sysmain) {
        section += `
Write-Log "[SERVICE] Setting Superfetch to Manual..." "Cyan"
try {
    Set-Service -Name "SysMain" -StartupType Manual ${whatIf} -ErrorAction Stop
    Write-Log "   OK: SysMain (Superfetch) set to Manual" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not modify SysMain service" "Yellow"
    $script:errorCount++
}
`;
    }

    if (services.wsearch) {
        section += `
Write-Log "[SERVICE] Setting Windows Search to Manual..." "Cyan"
try {
    Set-Service -Name "WSearch" -StartupType Manual ${whatIf} -ErrorAction Stop
    Write-Log "   OK: Windows Search set to Manual (saves CPU/disk)" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not modify Windows Search service" "Yellow"
    $script:errorCount++
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generateDiskCleanupSection(disk, whatIf) {
    let section = `
Write-Log "=============================================================" "DarkCyan"
Write-Log "                  DISK MAINTENANCE                         " "DarkCyan"
Write-Log "=============================================================" "DarkCyan"
Write-Log ""

`;

    if (disk.winsxs) {
        section += `
Write-Log "[DISK] Cleaning Component Store (WinSxS)..." "Cyan"
Write-Log "   [INFO] This may take 5-10 minutes..." "Gray"
try {
    $result = Dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase
    Write-Log "   OK: Component Store cleaned" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not clean component store" "Yellow"
    $script:errorCount++
}
`;
    }

    if (disk.updates) {
        section += `
Write-Log "[DISK] Removing Old Windows Updates..." "Cyan"
try {
    $updatePath = "C:\\Windows\\SoftwareDistribution\\Download"
    if (Test-Path $updatePath) {
        $sizeBefore = (Get-ChildItem $updatePath -Recurse | Measure-Object -Property Length -Sum).Sum
        $sizeInMB = [math]::Round($sizeBefore / 1MB, 2)
        Remove-Item "$updatePath\\*" -Recurse -Force ${whatIf} -ErrorAction Stop
        $script:totalCleaned += $sizeBefore
        Write-Log "   Old updates removed - $sizeInMB MB" "Green"
        $script:itemsCleaned++
    }
} catch {
    Write-Log "   WARNING: Could not remove old updates" "Yellow"
    $script:errorCount++
}
`;
    }

    if (disk.logs) {
        section += `
Write-Log "[DISK] Clearing Old System Logs..." "Cyan"
try {
    Get-EventLog -LogName * | ForEach-Object {
        try {
            Clear-EventLog -LogName $_.Log ${whatIf} -ErrorAction Stop
        } catch {
            # Some logs can't be cleared - skip them
        }
    }
    Write-Log "   OK: System logs cleared" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   WARNING: Could not clear all logs" "Yellow"
    $script:errorCount++
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generateStartupSection(startup) {
    let section = `
Write-Log "=============================================================" "Green"
Write-Log "                  STARTUP ANALYSIS                         " "Green"
Write-Log "=============================================================" "Green"
Write-Log ""

Write-Log "[STARTUP] Scanning startup items..." "Cyan"

`;

    if (startup.scan && startup.report) {
        section += `
$startupItems = @()

# Registry startup locations
$regPaths = @(
    "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
    "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"
)

foreach ($path in $regPaths) {
    if (Test-Path $path) {
        Get-ItemProperty $path | ForEach-Object {
            $_.PSObject.Properties | Where-Object { $_.Name -notlike "PS*" } | ForEach-Object {
                $startupItems += [PSCustomObject]@{
                    Name = $_.Name
                    Command = $_.Value
                    Location = $path
                }
            }
        }
    }
}

# Create HTML report in same folder as script
$reportPath = "$PSScriptRoot\\Startup_Report_$(Get-Date -Format "yyyy-MM-dd_HH-mm").html"
$reportTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$html = @"
<!DOCTYPE html>
<html>
<head>
    <title>Startup Programs Report</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 20px; background: #f5f5f5; }
        h1 { color: #0078d4; }
        table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #0078d4; color: white; }
        tr:hover { background: #f0f0f0; }
        .recommendation { color: #107c10; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Startup Programs Report</h1>
    <p>Generated: $reportTime</p>
    <p>Found $($startupItems.Count) startup items</p>
    <table>
        <tr>
            <th>Program Name</th>
            <th>Command</th>
            <th>Location</th>
            <th>Recommendation</th>
        </tr>
"@

foreach ($item in $startupItems) {
    $recommendation = "Review - Can likely be disabled"
    if ($item.Name -like "*antivirus*" -or $item.Name -like "*defender*") {
        $recommendation = "Keep - Security software"
    } elseif ($item.Name -like "*driver*" -or $item.Name -like "*audio*") {
        $recommendation = "Keep - System driver"
    }
    
    $html += @"
        <tr>
            <td>$($item.Name)</td>
            <td><small>$($item.Command)</small></td>
            <td><small>$($item.Location)</small></td>
            <td class="recommendation">$recommendation</td>
        </tr>
"@

}

$html += @"
    </table>
    <br>
    <p><strong>Note:</strong> To disable startup programs, press Win+R, type "msconfig", go to Startup tab.</p>
</body>
</html>
"@


$html | Out-File -FilePath $reportPath -Encoding UTF8

Write-Log "   OK: Report created: $reportPath" "Green"
Write-Log "   [FILE] Opening report in browser..." "Cyan"
Start-Process $reportPath

$script:itemsCleaned++
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

// ============================================
// SCHEDULED MAINTENANCE SCRIPT BUILDER
// ============================================
// Only includes recurring tasks that benefit from periodic execution

function buildScheduledMaintenanceScript(selected) {
    // Filter to only recurring tasks
    const recurringTasks = {
        temp: selected.temp || {}, // Temp files accumulate - RECURRING
        disk: {
            winsxs: false, // One-time cleanup - takes too long
            updates: selected.disk?.updates || false, // Can recur
            logs: selected.disk?.logs || false // Can recur
        },
        // Privacy, performance, services, startup - ONE-TIME only
        privacy: {}, // These are settings, not cleanup
        performance: {}, // One-time configuration
        services: {}, // One-time configuration  
        startup: {} // Analysis, not maintenance
    };
    
    // Build script without backup (automated task doesn't need interactive backup)
    return buildPowerShellScript(recurringTasks, false, false, false);
}

// ============================================
// SCHEDULED TASK SCRIPT BUILDER (OLD - DEPRECATED)
// ============================================

function buildScheduledTaskScript(selected) {
    const baseScript = buildPowerShellScript(selected, false, false);
    
    // Save the optimization script first
    const scriptContent = baseScript.replace(/Read-Host "Press Enter to exit"/g, '# Auto-exit for scheduled task');
    
    const taskScript = `# ============================================
# Weekly Maintenance Task Creator
# Generated: ${new Date().toLocaleString()}
# ============================================
# IMPORTANT: Must be run as Administrator to create scheduled tasks
# ============================================

# FORCE WINDOW TO STAY OPEN ON ERROR
$ErrorActionPreference = "Continue"
$Host.UI.RawUI.WindowTitle = "Weekly Maintenance Task Creator"

# Define Write-Log function for this wrapper script
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Log ""
    Write-Log "=============================================================" "Red"
    Write-Log "                    ADMIN REQUIRED!                        " "Red"
    Write-Log "=============================================================" "Red"
    Write-Log ""
    Write-Log "WARNING: This script MUST be run as Administrator to create scheduled tasks!" "Yellow"
    Write-Log ""
    Write-Log "How to fix:" "Cyan"
    Write-Log "  1. Close this window" "Gray"
    Write-Log "  2. Right-click this script file" "Gray"
    Write-Log "  3. Select 'Run as Administrator'" "Gray"
    Write-Log ""
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Log ""
Write-Log "=============================================================" "Cyan"
Write-Log "      WEEKLY MAINTENANCE TASK CREATOR                      " "Cyan"
Write-Log "=============================================================" "Cyan"
Write-Log ""

# Create the optimization script file
$scriptPath = "$env:ProgramData\\WindowsOptimization\\WeeklyMaintenance.ps1"
$scriptDir = Split-Path $scriptPath -Parent

Write-Log "[FILES] Creating script directory..." "Cyan"
if (-not (Test-Path $scriptDir)) {
    New-Item -Path $scriptDir -ItemType Directory -Force | Out-Null
}

Write-Log "[DISK] Saving optimization script..." "Cyan"
@'
${scriptContent}
'@ | Out-File -FilePath $scriptPath -Encoding UTF8 -Force

Write-Log "   OK: Script saved to: $scriptPath" "Green"
Write-Log ""

# Create scheduled task
Write-Log "Creating scheduled task..." "Cyan"

$taskName = "Windows Weekly Optimization"
$taskDescription = "Automatically runs selected Windows optimizations every Sunday at 2 AM"

# Remove existing task if it exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Log "   [INFO] Removed existing task" "Gray"
}

# Create new task
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \`"$scriptPath\`""
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 2am
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

try {
    Register-ScheduledTask -TaskName $taskName -Description $taskDescription -Action $action -Trigger $trigger -Principal $principal -Settings $settings -ErrorAction Stop | Out-Null
    Write-Log "   OK: Task created successfully!" "Green"
    
    # Verify task was created
    $verifyTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    if ($verifyTask) {
        Write-Log "   OK: Task verified in Task Scheduler" "Green"
        Write-Log "   OK: Next run: $(($verifyTask | Get-ScheduledTaskInfo).NextRunTime)" "Green"
    }
} catch {
    Write-Log "   ERROR: Failed to create task: $($_.Exception.Message)" "Red"
    Write-Log "   [INFO] You may need to run this script as Administrator" "Yellow"
}

Write-Log ""
Write-Log "=============================================================" "Green"
Write-Log "                    SETUP COMPLETE!                        " "Green"
Write-Log "=============================================================" "Green"
Write-Log ""
Write-Log "[BACKUP] SCHEDULED TASK DETAILS:" "Cyan"
Write-Log ""
Write-Log "   SUCCESS: Task Name: Windows Weekly Optimization" "White"
Write-Log "   Schedule: Every Sunday at 2:00 AM" "White"
Write-Log "   [FILES] Script: $scriptPath" "White"
Write-Log ""
Write-Log "-------------------------------------------------------------" "Gray"
Write-Log ""
Write-Log "[TIP] TO MANAGE THIS TASK:" "Yellow"
Write-Log ""
Write-Log "   1. Press Win+R" "Gray"
Write-Log "   2. Type: taskschd.msc" "Gray"
Write-Log "   3. Press Enter" "Gray"
Write-Log "   4. Find 'Windows Weekly Optimization' in the list" "Gray"
Write-Log "   5. Right-click to Run, Edit, Disable, or Delete" "Gray"
Write-Log ""
Write-Log "-------------------------------------------------------------" "Gray"
Write-Log ""
Write-Log "This window will stay open so you can review the results." "Yellow"
Write-Log ""
Read-Host "Press ENTER to close this window"
`;

    return taskScript;
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('SUCCESS: Windows 11 Optimization Portal - Ready');
    
    // Close modal when clicking outside
    document.getElementById('scriptModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
});
