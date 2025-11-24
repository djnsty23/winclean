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
    notification.innerHTML = `<div style="font-size:1.5rem">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</div><div>${message}</div>`;
    
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
    
    showNotification('✅ Script downloaded! Check your Downloads folder.', 'success');
}

function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, 19).replace('T', '_');
}

// ============================================
// MAIN SCRIPT GENERATION FUNCTION
// ============================================

function generateScript(previewMode = false, scheduleMode = false) {
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
        showNotification('⚠️ Please select at least one optimization option!', 'warning');
        return;
    }

    // Generate the script
    const script = buildPowerShellScript(selected, previewMode, scheduleMode, createBackup);
    
    if (previewMode) {
        // Show preview in modal
        const modalContent = `
            <div class="alert alert-info">
                <div style="font-size:1.5rem">ℹ️</div>
                <div><strong>Preview Mode</strong><br>This script will analyze what would be cleaned without making changes.</div>
            </div>
            <div class="script-preview">${escapeHtml(script)}</div>
            <div style="margin-top:1rem; display:flex; gap:1rem;">
                <button class="btn btn-generate" onclick="downloadPreviewScript()">📥 Download Preview Script</button>
                <button class="btn btn-preview" onclick="closeModal()">Close</button>
            </div>
        `;
        showModal('Script Preview - Safe to Review', modalContent);
        window.currentScript = script;
    } else if (scheduleMode) {
        // Generate scheduled task script
        const taskScript = buildScheduledTaskScript(selected);
        const modalContent = `
            <div class="alert alert-info">
                <div style="font-size:1.5rem">⏰</div>
                <div><strong>Scheduled Task Creator</strong><br>This will create a weekly maintenance task that runs your selected optimizations automatically.</div>
            </div>
            <div class="script-preview">${escapeHtml(taskScript)}</div>
            <div style="margin-top:1rem; display:flex; gap:1rem;">
                <button class="btn btn-schedule" onclick="downloadScheduledScript()">📥 Download Task Scheduler</button>
                <button class="btn btn-preview" onclick="closeModal()">Close</button>
            </div>
        `;
        showModal('Weekly Maintenance Task', modalContent);
        window.currentScript = taskScript;
    } else {
        // Regular mode - show instructions then download
        const filename = `Windows_Optimizer_${getTimestamp()}.ps1`;
        showInstructionsModal(filename, script, 'optimize');
    }
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
                <h4>📋 How to Run Your Optimization Script</h4>
                <ol>
                    <li><strong>Download the script</strong> by clicking the button below</li>
                    <li><strong>Locate the file</strong> in your Downloads folder (<code>${filename}</code>)</li>
                    <li><strong>🔒 UNBLOCK THE FILE (Important!):</strong>
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
                    <strong>✅ Why Unblock?</strong><br>
                    This tells Windows you trust THIS specific file. It's MORE SECURE than changing your PowerShell execution policy globally!
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: #fff4e6; border-radius: 6px; border-left: 4px solid var(--warning);">
                    <strong>⚠️ Alternative: One-Time Bypass (Also Secure)</strong><br>
                    If you prefer NOT to unblock, open PowerShell as Admin and run:<br>
                    <code style="background: rgba(0,0,0,0.1); padding: 0.3rem; border-radius: 3px; display: block; margin-top: 0.5rem;">powershell -ExecutionPolicy Bypass -File "C:\\Downloads\\${filename}"</code>
                    This only bypasses policy for THIS ONE execution (secure!).
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: #e6f3ff; border-radius: 6px;">
                    <strong>💡 What to expect:</strong> A log file will appear on your <strong>Desktop</strong> showing everything that happened. 
                    If backup was enabled, you'll also see <strong>RESTORE script</strong> and <strong>backup JSON file</strong>.
                </div>
            </div>
        `;
    } else if (type === 'schedule') {
        instructions = `
            <div class="instructions-box">
                <h4>📋 How to Set Up Scheduled Maintenance</h4>
                <ol>
                    <li><strong>Download the script</strong> by clicking the button below</li>
                    <li><strong>Locate the file</strong> in your Downloads folder (<code>${filename}</code>)</li>
                    <li><strong>Right-click the file</strong> → Select <strong>"Run with PowerShell"</strong></li>
                    <li>Click <strong>"Yes"</strong> when prompted for administrator access</li>
                    <li>The script will create a <strong>weekly task</strong> that runs every Sunday at 2 AM</li>
                    <li>To manage it later, press <strong>Win+R</strong>, type <code>taskschd.msc</code>, and look for <strong>"Windows Weekly Optimization"</strong></li>
                </ol>
                <div style="margin-top: 1rem; padding: 1rem; background: #e6f9e6; border-radius: 6px;">
                    <strong>✅ What it does:</strong> Creates a scheduled task that automatically runs your selected optimizations every week. 
                    You can disable or delete it anytime from Task Scheduler.
                </div>
            </div>
        `;
    }
    
    const modalContent = `
        <div class="alert alert-success">
            <div style="font-size:1.5rem">✅</div>
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
$logFile = "$PSScriptRoot\\Windows_Optimization_Log_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').txt"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Windows 11 Optimization Script - ${mode} Mode" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Creating log file..." -ForegroundColor Cyan

try {
    "═══════════════════════════════════════════════════════════" | Out-File -FilePath $logFile -Encoding UTF8 -Force
    "Windows 11 Optimization Script - ${mode} MODE" | Add-Content -Path $logFile
    "Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Add-Content -Path $logFile
    "Log file: $logFile" | Add-Content -Path $logFile
    "═══════════════════════════════════════════════════════════" | Add-Content -Path $logFile
    "" | Add-Content -Path $logFile
    Write-Host "✓ Log file created at: $logFile" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ ERROR: Could not create log file!" -ForegroundColor Red
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
Write-Log "╔═══════════════════════════════════════════════════════════╗" "Cyan"
Write-Log "║           WINDOWS 11 ${mode} SCRIPT                    ║" "Cyan"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Cyan"
Write-Log ""

# Check admin privileges
try {
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if (-not $isAdmin) {
        Write-Log "⚠️  WARNING: Not running as Administrator" "Yellow"
        Write-Log "   Some operations may fail without admin rights." "Yellow"
        Write-Log "   To fix: Close this, right-click script → 'Run as Administrator'" "Gray"
        Write-Log ""
        Write-Log "Continuing in 5 seconds..." "Yellow"
        Start-Sleep -Seconds 5
    } else {
        Write-Log "✅ Running with Administrator privileges" "Green"
    }
} catch {
    Write-Log "⚠️  Could not verify admin status" "Yellow"
}
Write-Log ""

`;

    if (!previewMode && createBackup) {
        script += generateBackupSection(selected);
    } else if (!previewMode) {
        script += `
# Create System Restore Point
Write-Log "🛡️  Creating System Restore Point..." "Yellow"
try {
    Enable-ComputerRestore -Drive "C:\\"
    Checkpoint-Computer -Description "Before Optimization - $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -RestorePointType "MODIFY_SETTINGS"
    Write-Log "   ✓ Restore point created successfully!" "Green"
} catch {
    Write-Log "   ⚠️  Could not create restore point: $($_.Exception.Message)" "Yellow"
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
Write-Log "╔═══════════════════════════════════════════════════════════╗" "Green"
Write-Log "║                  ${mode} COMPLETE!                     ║" "Green"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Green"
Write-Log ""
Write-Log "╔═══════════════════════════════════════════════════════════╗" "Green"
Write-Log "║                  ${mode} COMPLETE!                     ║" "Green"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Green"
Write-Log ""
Write-Log "📊 FINAL SUMMARY:" "Cyan"
Write-Log ""
Write-Log "   ✅ Items processed: $itemsCleaned" "Green"
Write-Log "   💾 Space freed: $([math]::Round($totalCleaned / 1MB, 2)) MB" "Green"
if ($errorCount -gt 0) {
    Write-Log "   ⚠️  Items skipped (files in use): $errorCount" "Yellow"
}
Write-Log ""
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Gray"
Write-Log ""
Write-Log "✅ SUCCESS! Your system has been optimized!" "Green"
Write-Log ""
Write-Log "📄 Full log saved to: $logFile" "Cyan"
Write-Log ""
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Gray"
Write-Log ""
Write-Log "Script completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "Gray"
Write-Log ""

# Open log file automatically
Write-Log "Opening log file..." "Cyan"
Start-Process notepad.exe $logFile

Write-Log ""
Write-Log "Opening log file in Notepad..." "Cyan"
try {
    Start-Process notepad.exe $logFile
    Write-Log "✅ Log file opened" "Green"
} catch {
    Write-Log "⚠️  Could not open log file automatically" "Yellow"
    Write-Log "   You can find it at: $logFile" "Gray"
}

Write-Log ""
Write-Log "═══════════════════════════════════════════════════════════" "Cyan"
Write-Log "Script completed. Window will stay open." "Cyan"
Write-Log "═══════════════════════════════════════════════════════════" "Cyan"
Write-Host ""

} catch {
    # CRITICAL ERROR HANDLER - Shows ALL errors before closing
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║                   CRITICAL ERROR!                         ║" -ForegroundColor Red
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Red
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
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host ""
    
    # Try to save error to same folder as script
    try {
        $errorFile = "$PSScriptRoot\\Windows_Optimization_ERROR_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').txt"
        @"
WINDOWS OPTIMIZATION SCRIPT ERROR LOG
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

ERROR MESSAGE:
$($_.Exception.Message)

ERROR LOCATION:
$($_.InvocationInfo.PositionMessage)

FULL ERROR DETAILS:
$($_ | Format-List * -Force | Out-String)

STACK TRACE:
$($_.ScriptStackTrace)
"@ | Out-File -FilePath $errorFile -Encoding UTF8
        Write-Host "✅ Error details saved to: $errorFile" -ForegroundColor Green
        Start-Process notepad.exe $errorFile
    } catch {
        Write-Host "⚠️  Could not save error log to file" -ForegroundColor Yellow
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

Write-Log "╔═══════════════════════════════════════════════════════════╗" "Cyan"
Write-Log "║                  BACKING UP CURRENT STATE                 ║" "Cyan"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Cyan"
Write-Log ""

$backupTimestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupPath = "$PSScriptRoot\\Windows_Optimization_Backup_$backupTimestamp.json"
$restoreScriptPath = "$PSScriptRoot\\RESTORE_Windows_Settings_$backupTimestamp.ps1"

Write-Log "💾 Creating backup of current settings..." "Cyan"

$backup = @{
    Timestamp = $backupTimestamp
    ComputerName = $env:COMPUTERNAME
    UserName = $env:USERNAME
    Registry = @{}
    Services = @{}
    SystemSettings = @{}
}

# Backup Registry Settings
Write-Log "   📋 Backing up registry settings..." "Gray"

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
            if ($value) {
                $key = "$($reg.Path)\\$($reg.Name)"
                $backup.Registry[$key] = $value.$($reg.Name)
            }
        }
    } catch {
        # Path doesn't exist, skip
    }
}

# Backup Service States
Write-Log "   ⚙️  Backing up service states..." "Gray"

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
    } catch {
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
    Write-Log "   ✓ Backup saved to: $backupPath" "Green"
    
    # Verify backup was created
    if (Test-Path $backupPath) {
        $backupSize = (Get-Item $backupPath).Length
        Write-Log "   ✓ Backup file size: $([math]::Round($backupSize / 1KB, 2)) KB" "Green"
    } else {
        Write-Log "   ⚠️  Warning: Backup file not found!" "Yellow"
    }
} catch {
    Write-Log "   ❌ Failed to create backup: $($_.Exception.Message)" "Red"
}

# Generate Restore Script
Write-Log "   📝 Generating restore script..." "Gray"

$restoreScript = @'
# ============================================
# RESTORE Windows Settings
# Backup created: TIMESTAMP_PLACEHOLDER
# ============================================
# IMPORTANT: Run as Administrator for full functionality
# ============================================

# Define Write-Log function FIRST
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

Write-Log ""
Write-Log "╔═══════════════════════════════════════════════════════════╗" "Magenta"
Write-Log "║           RESTORING WINDOWS SETTINGS                      ║" "Magenta"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Magenta"
Write-Log ""

$backupFile = "BACKUP_PATH_PLACEHOLDER"

if (-not (Test-Path $backupFile)) {
    Write-Log "❌ ERROR: Backup file not found: $backupFile" "Red"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Log "📂 Loading backup from: $backupFile" "Cyan"
$backup = Get-Content $backupFile | ConvertFrom-Json

Write-Log "   ℹ️  Backup created: $($backup.Timestamp)" "Gray"
Write-Log "   ℹ️  Computer: $($backup.ComputerName)" "Gray"
Write-Log ""

$restored = 0
$errors = 0

# Restore Registry Settings
Write-Log "📋 Restoring registry settings..." "Yellow"
foreach ($key in $backup.Registry.PSObject.Properties) {
    $fullPath = $key.Name
    $parts = $fullPath -split '\\\\'
    $valueName = $parts[-1]
    $regPath = $parts[0..($parts.Length-2)] -join '\\'
    
    try {
        if (-not (Test-Path $regPath)) {
            New-Item -Path $regPath -Force | Out-Null
        }
        Set-ItemProperty -Path $regPath -Name $valueName -Value $key.Value -ErrorAction Stop
        Write-Log "   ✓ Restored: $fullPath" "Green"
        $restored++
    } catch {
        Write-Log "   ❌ Failed: $fullPath" "Red"
        $errors++
    }
}

# Restore Services
Write-Log ""
Write-Log "⚙️  Restoring service states..." "Yellow"
foreach ($svc in $backup.Services.PSObject.Properties) {
    try {
        $service = Get-Service -Name $svc.Name -ErrorAction Stop
        $startType = $svc.Value.StartType
        
        Set-Service -Name $svc.Name -StartupType $startType -ErrorAction Stop
        Write-Log "   ✓ Restored service: $($svc.Name) -> $startType" "Green"
        $restored++
    } catch {
        Write-Log "   ❌ Failed to restore service: $($svc.Name)" "Red"
        $errors++
    }
}

# Restore Hibernation
Write-Log ""
if ($backup.SystemSettings.HibernationEnabled -eq $true) {
    Write-Log "🔋 Re-enabling hibernation..." "Yellow"
    try {
        powercfg -h on
        Write-Log "   ✓ Hibernation enabled" "Green"
        $restored++
    } catch {
        Write-Log "   ❌ Could not enable hibernation" "Red"
        $errors++
    }
}

Write-Log ""
Write-Log "╔═══════════════════════════════════════════════════════════╗" "Green"
Write-Log "║                 RESTORE COMPLETE!                         ║" "Green"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Green"
Write-Log ""
Write-Log "📊 Summary:" "Cyan"
Write-Log "   • Settings restored: $restored" "White"
Write-Log "   • Errors: $errors" "White"
Write-Log ""
Write-Log "✅ Your settings have been restored to their previous state!" "Green"
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
        Write-Log "   ✓ Restore script created: $restoreScriptPath" "Green"
        $restoreSize = (Get-Item $restoreScriptPath).Length
        Write-Log "   ✓ Restore script size: $([math]::Round($restoreSize / 1KB, 2)) KB" "Green"
    } else {
        Write-Log "   ⚠️  Warning: Restore script not found!" "Yellow"
    }
} catch {
    Write-Log "   ❌ Failed to create restore script: $($_.Exception.Message)" "Red"
}

Write-Log ""
Write-Log "╔═══════════════════════════════════════════════════════════╗" "Green"
Write-Log "║  ✅ BACKUP COMPLETE - Safe to proceed with optimization   ║" "Green"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Green"
Write-Log ""
Write-Log "📁 Files saved in script folder:" "Cyan"
Write-Log "   • Backup: Windows_Optimization_Backup_$backupTimestamp.json" "White"
Write-Log "   • Restore: RESTORE_Windows_Settings_$backupTimestamp.ps1" "White"
Write-Log "   • Location: $PSScriptRoot" "Gray"
Write-Log ""
Write-Log "💡 To undo changes later, right-click the RESTORE script → 'Run with PowerShell'" "Yellow"
Write-Log ""
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Gray"
Write-Log ""

`;
}

// ============================================
// SECTION GENERATORS
// ============================================

function generateTempCleanupSection(temp, whatIf) {
    let section = `
Write-Log "╔═══════════════════════════════════════════════════════════╗" "Yellow"
Write-Log "║                  TEMP FILES CLEANUP                       ║" "Yellow"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Yellow"
Write-Log ""

function Clean-Directory {
    param([string]$Path, [string]$Description)
    
    if (-not (Test-Path $Path)) {
        Write-Log "   ⏭️  Skipping $Description - Path not found" "Gray"
        return
    }
    
    Write-Log "   🔍 Scanning $Description..." "Cyan"
    $sizeBefore = 0
    $filesRemoved = 0
    $filesSkipped = 0
    
    try {
        $items = Get-ChildItem -Path $Path -Recurse -Force -ErrorAction SilentlyContinue
        $itemCount = ($items | Measure-Object).Count
        $sizeBefore = ($items | Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
        $sizeMB = [math]::Round($sizeBefore / 1MB, 2)
        
        Write-Log "   📊 Found $itemCount items ($sizeMB MB)" "Gray"
        
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
            Write-Log "   ✅ Cleaned: $filesRemoved items ($sizeMB MB)" "Green"
        }
        if ($filesSkipped -gt 0) {
            Write-Log "   ⏭️  Skipped: $filesSkipped items (in use)" "Yellow"
        }
        
    } catch {
        Write-Log "   ⚠️  Some files were in use (this is normal)" "Yellow"
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
Write-Log "🗑️  Emptying Recycle Bin..." "Cyan"
try {
    Clear-RecycleBin -Force ${whatIf} -ErrorAction Stop
    Write-Log "   ✓ Recycle Bin emptied" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not empty recycle bin: $($_.Exception.Message)" "Yellow"
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generatePrivacySection(privacy, whatIf) {
    let section = `
Write-Log "╔═══════════════════════════════════════════════════════════╗" "Magenta"
Write-Log "║                  PRIVACY SETTINGS                         ║" "Magenta"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Magenta"
Write-Log ""

`;

    if (privacy.telemetry) {
        section += `
Write-Log "🔒 Minimizing Telemetry..." "Cyan"
try {
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -Value 0 ${whatIf} -ErrorAction Stop
    Write-Log "   ✓ Telemetry set to minimum" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not modify telemetry settings" "Yellow"
    $script:errorCount++
}
`;
    }

    if (privacy.ads) {
        section += `
Write-Log "🔒 Disabling Advertising ID..." "Cyan"
try {
    if (-not (Test-Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo")) {
        New-Item -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Force ${whatIf} | Out-Null
    }
    Set-ItemProperty -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Name "Enabled" -Value 0 ${whatIf} -ErrorAction Stop
    Write-Log "   ✓ Advertising ID disabled" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not disable advertising ID" "Yellow"
    $script:errorCount++
}
`;
    }

    if (privacy.cortana) {
        section += `
Write-Log "🔒 Disabling Cortana..." "Cyan"
try {
    if (-not (Test-Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search")) {
        New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Force ${whatIf} | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Name "AllowCortana" -Value 0 ${whatIf} -ErrorAction Stop
    Write-Log "   ✓ Cortana disabled" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not disable Cortana" "Yellow"
    $script:errorCount++
}
`;
    }

    if (privacy.location) {
        section += `
Write-Log "🔒 Disabling Location Tracking..." "Cyan"
try {
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" -Name "Value" -Value "Deny" ${whatIf} -ErrorAction Stop
    Write-Log "   ✓ Location tracking disabled" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not disable location tracking" "Yellow"
    $script:errorCount++
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generatePerformanceSection(perf, whatIf) {
    let section = `
Write-Log "╔═══════════════════════════════════════════════════════════╗" "Blue"
Write-Log "║                 PERFORMANCE TUNING                        ║" "Blue"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Blue"
Write-Log ""

`;

    if (perf.visual) {
        section += `
Write-Log "🎯 Optimizing Visual Effects..." "Cyan"
try {
    Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" -Name "VisualFXSetting" -Value 2 ${whatIf} -ErrorAction Stop
    Write-Log "   ✓ Visual effects set to best performance" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not modify visual effects" "Yellow"
    $script:errorCount++
}
`;
    }

    if (perf.gamemode) {
        section += `
Write-Log "🎯 Enabling Game Mode..." "Cyan"
try {
    if (-not (Test-Path "HKCU:\\Software\\Microsoft\\GameBar")) {
        New-Item -Path "HKCU:\\Software\\Microsoft\\GameBar" -Force ${whatIf} | Out-Null
    }
    Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AutoGameModeEnabled" -Value 1 ${whatIf} -ErrorAction Stop
    Write-Log "   ✓ Game Mode enabled" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not enable Game Mode" "Yellow"
    $script:errorCount++
}
`;
    }

    if (perf.superfetch) {
        section += `
Write-Log "🎯 Disabling Superfetch (for SSD)..." "Cyan"
try {
    Set-Service -Name "SysMain" -StartupType Disabled ${whatIf} -ErrorAction Stop
    Stop-Service -Name "SysMain" -Force ${whatIf} -ErrorAction SilentlyContinue
    Write-Log "   ✓ Superfetch disabled" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not disable Superfetch" "Yellow"
    $script:errorCount++
}
`;
    }

    if (perf.hibernation) {
        section += `
Write-Log "🎯 Disabling Hibernation..." "Cyan"
try {
    powercfg -h off
    Write-Log "   ✓ Hibernation disabled (hiberfil.sys deleted)" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not disable hibernation" "Yellow"
    $script:errorCount++
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generateServicesSection(services, whatIf) {
    let section = `
Write-Log "╔═══════════════════════════════════════════════════════════╗" "DarkYellow"
Write-Log "║                  WINDOWS SERVICES                         ║" "DarkYellow"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "DarkYellow"
Write-Log ""

`;

    if (services.diagtrack) {
        section += `
Write-Log "⚙️  Disabling Diagnostics Tracking Service..." "Cyan"
try {
    Set-Service -Name "DiagTrack" -StartupType Disabled ${whatIf} -ErrorAction Stop
    Stop-Service -Name "DiagTrack" -Force ${whatIf} -ErrorAction SilentlyContinue
    Write-Log "   ✓ DiagTrack service disabled" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not modify DiagTrack service" "Yellow"
    $script:errorCount++
}
`;
    }

    if (services.sysmain) {
        section += `
Write-Log "⚙️  Setting Superfetch to Manual..." "Cyan"
try {
    Set-Service -Name "SysMain" -StartupType Manual ${whatIf} -ErrorAction Stop
    Write-Log "   ✓ SysMain (Superfetch) set to Manual" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not modify SysMain service" "Yellow"
    $script:errorCount++
}
`;
    }

    if (services.wsearch) {
        section += `
Write-Log "⚙️  Setting Windows Search to Manual..." "Cyan"
try {
    Set-Service -Name "WSearch" -StartupType Manual ${whatIf} -ErrorAction Stop
    Write-Log "   ✓ Windows Search set to Manual (saves CPU/disk)" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not modify Windows Search service" "Yellow"
    $script:errorCount++
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generateDiskCleanupSection(disk, whatIf) {
    let section = `
Write-Log "╔═══════════════════════════════════════════════════════════╗" "DarkCyan"
Write-Log "║                  DISK MAINTENANCE                         ║" "DarkCyan"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "DarkCyan"
Write-Log ""

`;

    if (disk.winsxs) {
        section += `
Write-Log "💾 Cleaning Component Store (WinSxS)..." "Cyan"
Write-Log "   ⏱️  This may take 5-10 minutes..." "Gray"
try {
    $result = Dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase
    Write-Log "   ✓ Component Store cleaned" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not clean component store" "Yellow"
    $script:errorCount++
}
`;
    }

    if (disk.updates) {
        section += `
Write-Log "💾 Removing Old Windows Updates..." "Cyan"
try {
    $updatePath = "C:\\Windows\\SoftwareDistribution\\Download"
    if (Test-Path $updatePath) {
        $sizeBefore = (Get-ChildItem $updatePath -Recurse | Measure-Object -Property Length -Sum).Sum
        $sizeMB = [math]::Round($sizeBefore / 1MB, 2)
        Remove-Item "$updatePath\\*" -Recurse -Force ${whatIf} -ErrorAction Stop
        $script:totalCleaned += $sizeBefore
        Write-Log "   ✓ Old updates removed ($sizeMB MB)" "Green"
        $script:itemsCleaned++
    }
} catch {
    Write-Log "   ⚠️  Could not remove old updates" "Yellow"
    $script:errorCount++
}
`;
    }

    if (disk.logs) {
        section += `
Write-Log "💾 Clearing Old System Logs..." "Cyan"
try {
    Get-EventLog -LogName * | ForEach-Object {
        try {
            Clear-EventLog -LogName $_.Log ${whatIf} -ErrorAction Stop
        } catch {
            # Some logs can't be cleared - skip them
        }
    }
    Write-Log "   ✓ System logs cleared" "Green"
    $script:itemsCleaned++
} catch {
    Write-Log "   ⚠️  Could not clear all logs" "Yellow"
    $script:errorCount++
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generateStartupSection(startup) {
    let section = `
Write-Log "╔═══════════════════════════════════════════════════════════╗" "Green"
Write-Log "║                  STARTUP ANALYSIS                         ║" "Green"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Green"
Write-Log ""

Write-Log "⚡ Scanning startup items..." "Cyan"

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
$reportPath = "$PSScriptRoot\\Startup_Report_$(Get-Date -Format 'yyyy-MM-dd_HH-mm').html"
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
    <h1>🚀 Startup Programs Report</h1>
    <p>Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')</p>
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

Write-Log "   ✓ Report created: $reportPath" "Green"
Write-Log "   📄 Opening report in browser..." "Cyan"
Start-Process $reportPath

$script:itemsCleaned++
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

// ============================================
// SCHEDULED TASK SCRIPT BUILDER
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
    Write-Log "╔═══════════════════════════════════════════════════════════╗" "Red"
    Write-Log "║                    ADMIN REQUIRED!                        ║" "Red"
    Write-Log "╚═══════════════════════════════════════════════════════════╝" "Red"
    Write-Log ""
    Write-Log "⚠️  This script MUST be run as Administrator to create scheduled tasks!" "Yellow"
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
Write-Log "╔═══════════════════════════════════════════════════════════╗" "Cyan"
Write-Log "║      WEEKLY MAINTENANCE TASK CREATOR                      ║" "Cyan"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Cyan"
Write-Log ""

# Create the optimization script file
$scriptPath = "$env:ProgramData\\WindowsOptimization\\WeeklyMaintenance.ps1"
$scriptDir = Split-Path $scriptPath -Parent

Write-Log "📁 Creating script directory..." "Cyan"
if (-not (Test-Path $scriptDir)) {
    New-Item -Path $scriptDir -ItemType Directory -Force | Out-Null
}

Write-Log "💾 Saving optimization script..." "Cyan"
@'
${scriptContent}
'@ | Out-File -FilePath $scriptPath -Encoding UTF8 -Force

Write-Log "   ✓ Script saved to: $scriptPath" "Green"
Write-Log ""

# Create scheduled task
Write-Log "⏰ Creating scheduled task..." "Cyan"

$taskName = "Windows Weekly Optimization"
$taskDescription = "Automatically runs selected Windows optimizations every Sunday at 2 AM"

# Remove existing task if it exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Log "   ℹ️  Removed existing task" "Gray"
}

# Create new task
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \`"$scriptPath\`""
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 2am
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

try {
    Register-ScheduledTask -TaskName $taskName -Description $taskDescription -Action $action -Trigger $trigger -Principal $principal -Settings $settings -ErrorAction Stop | Out-Null
    Write-Log "   ✓ Task created successfully!" "Green"
    
    # Verify task was created
    $verifyTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    if ($verifyTask) {
        Write-Log "   ✓ Task verified in Task Scheduler" "Green"
        Write-Log "   ✓ Next run: $(($verifyTask | Get-ScheduledTaskInfo).NextRunTime)" "Green"
    }
} catch {
    Write-Log "   ❌ Failed to create task: $($_.Exception.Message)" "Red"
    Write-Log "   ℹ️  You may need to run this script as Administrator" "Yellow"
}

Write-Log ""
Write-Log "╔═══════════════════════════════════════════════════════════╗" "Green"
Write-Log "║                    SETUP COMPLETE!                        ║" "Green"
Write-Log "╚═══════════════════════════════════════════════════════════╝" "Green"
Write-Log ""
Write-Log "📋 SCHEDULED TASK DETAILS:" "Cyan"
Write-Log ""
Write-Log "   ✅ Task Name: Windows Weekly Optimization" "White"
Write-Log "   📅 Schedule: Every Sunday at 2:00 AM" "White"
Write-Log "   📁 Script: $scriptPath" "White"
Write-Log ""
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Gray"
Write-Log ""
Write-Log "💡 TO MANAGE THIS TASK:" "Yellow"
Write-Log ""
Write-Log "   1. Press Win+R" "Gray"
Write-Log "   2. Type: taskschd.msc" "Gray"
Write-Log "   3. Press Enter" "Gray"
Write-Log "   4. Find 'Windows Weekly Optimization' in the list" "Gray"
Write-Log "   5. Right-click to Run, Edit, Disable, or Delete" "Gray"
Write-Log ""
Write-Log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Gray"
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
    console.log('✅ Windows 11 Optimization Portal - Ready');
    
    // Close modal when clicking outside
    document.getElementById('scriptModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
});
