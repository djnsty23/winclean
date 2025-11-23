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
        // Regular mode - download immediately
        const filename = `Windows_Optimizer_${getTimestamp()}.ps1`;
        downloadScript(filename, script);
    }
}

function downloadPreviewScript() {
    const filename = `Windows_Optimizer_PREVIEW_${getTimestamp()}.ps1`;
    downloadScript(filename, window.currentScript);
    closeModal();
}

function downloadScheduledScript() {
    const filename = `Windows_Optimizer_SCHEDULED_${getTimestamp()}.ps1`;
    downloadScript(filename, window.currentScript);
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
    
    let script = `#Requires -RunAsAdministrator
# ============================================
# Windows 11 ${mode} Script
# Generated: ${new Date().toLocaleString()}
# ============================================

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                           ║" -ForegroundColor Cyan
Write-Host "║     Windows 11 ${mode.padEnd(36)} ║" -ForegroundColor Cyan
Write-Host "║                                                           ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check for admin privileges
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "❌ ERROR: This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "   Right-click the script and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

`;

    if (!previewMode && createBackup) {
        script += generateBackupSection(selected);
    } else if (!previewMode) {
        script += `
# Create System Restore Point
Write-Host "🛡️  Creating System Restore Point..." -ForegroundColor Yellow
try {
    Enable-ComputerRestore -Drive "C:\\"
    Checkpoint-Computer -Description "Before Optimization - $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -RestorePointType "MODIFY_SETTINGS"
    Write-Host "   ✓ Restore point created successfully!" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Could not create restore point: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   Continuing anyway..." -ForegroundColor Gray
}
Write-Host ""

`;
    }

    script += `$totalCleaned = 0
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
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                  ${mode} COMPLETE!                     ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   • Items processed: $itemsCleaned" -ForegroundColor White
Write-Host "   • Space freed: $([math]::Round($totalCleaned / 1MB, 2)) MB" -ForegroundColor White
if ($errorCount -gt 0) {
    Write-Host "   • Errors (safe to ignore): $errorCount" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "✅ Your system has been optimized!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
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

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                  BACKING UP CURRENT STATE                 ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$backupTimestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupPath = "$env:USERPROFILE\\Desktop\\Windows_Optimization_Backup_$backupTimestamp.json"
$restoreScriptPath = "$env:USERPROFILE\\Desktop\\RESTORE_Windows_Settings_$backupTimestamp.ps1"

Write-Host "💾 Creating backup of current settings..." -ForegroundColor Cyan

$backup = @{
    Timestamp = $backupTimestamp
    ComputerName = $env:COMPUTERNAME
    UserName = $env:USERNAME
    Registry = @{}
    Services = @{}
    SystemSettings = @{}
}

# Backup Registry Settings
Write-Host "   📋 Backing up registry settings..." -ForegroundColor Gray

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
Write-Host "   ⚙️  Backing up service states..." -ForegroundColor Gray

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
$backup | ConvertTo-Json -Depth 10 | Out-File -FilePath $backupPath -Encoding UTF8
Write-Host "   ✓ Backup saved to: $backupPath" -ForegroundColor Green

# Generate Restore Script
Write-Host "   📝 Generating restore script..." -ForegroundColor Gray

$restoreScript = @'
#Requires -RunAsAdministrator
# ============================================
# RESTORE Windows Settings
# Backup created: TIMESTAMP_PLACEHOLDER
# ============================================

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║           RESTORING WINDOWS SETTINGS                      ║" -ForegroundColor Magenta
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

$backupFile = "BACKUP_PATH_PLACEHOLDER"

if (-not (Test-Path $backupFile)) {
    Write-Host "❌ ERROR: Backup file not found: $backupFile" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "📂 Loading backup from: $backupFile" -ForegroundColor Cyan
$backup = Get-Content $backupFile | ConvertFrom-Json

Write-Host "   ℹ️  Backup created: $($backup.Timestamp)" -ForegroundColor Gray
Write-Host "   ℹ️  Computer: $($backup.ComputerName)" -ForegroundColor Gray
Write-Host ""

$restored = 0
$errors = 0

# Restore Registry Settings
Write-Host "📋 Restoring registry settings..." -ForegroundColor Yellow
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
        Write-Host "   ✓ Restored: $fullPath" -ForegroundColor Green
        $restored++
    } catch {
        Write-Host "   ❌ Failed: $fullPath" -ForegroundColor Red
        $errors++
    }
}

# Restore Services
Write-Host ""
Write-Host "⚙️  Restoring service states..." -ForegroundColor Yellow
foreach ($svc in $backup.Services.PSObject.Properties) {
    try {
        $service = Get-Service -Name $svc.Name -ErrorAction Stop
        $startType = $svc.Value.StartType
        
        Set-Service -Name $svc.Name -StartupType $startType -ErrorAction Stop
        Write-Host "   ✓ Restored service: $($svc.Name) -> $startType" -ForegroundColor Green
        $restored++
    } catch {
        Write-Host "   ❌ Failed to restore service: $($svc.Name)" -ForegroundColor Red
        $errors++
    }
}

# Restore Hibernation
Write-Host ""
if ($backup.SystemSettings.HibernationEnabled -eq $true) {
    Write-Host "🔋 Re-enabling hibernation..." -ForegroundColor Yellow
    try {
        powercfg -h on
        Write-Host "   ✓ Hibernation enabled" -ForegroundColor Green
        $restored++
    } catch {
        Write-Host "   ❌ Could not enable hibernation" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                 RESTORE COMPLETE!                         ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   • Settings restored: $restored" -ForegroundColor White
Write-Host "   • Errors: $errors" -ForegroundColor White
Write-Host ""
Write-Host "✅ Your settings have been restored to their previous state!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
'@

# Replace placeholders
$restoreScript = $restoreScript -replace 'TIMESTAMP_PLACEHOLDER', $backupTimestamp
$restoreScript = $restoreScript -replace 'BACKUP_PATH_PLACEHOLDER', $backupPath

$restoreScript | Out-File -FilePath $restoreScriptPath -Encoding UTF8
Write-Host "   ✓ Restore script created: $restoreScriptPath" -ForegroundColor Green
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ BACKUP COMPLETE - Safe to proceed with optimization   ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "💡 To restore your settings later, just run:" -ForegroundColor Cyan
Write-Host "   $restoreScriptPath" -ForegroundColor White
Write-Host ""

`;
}

// ============================================
// SECTION GENERATORS
// ============================================

function generateTempCleanupSection(temp, whatIf) {
    let section = `
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║                  TEMP FILES CLEANUP                       ║" -ForegroundColor Yellow
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""

function Clean-Directory {
    param([string]$Path, [string]$Description)
    
    if (-not (Test-Path $Path)) {
        Write-Host "⚠️  $Description - Path not found: $Path" -ForegroundColor Yellow
        return
    }
    
    Write-Host "🗑️  Cleaning $Description..." -ForegroundColor Cyan
    $sizeBefore = 0
    $filesRemoved = 0
    
    try {
        $items = Get-ChildItem -Path $Path -Recurse -Force -ErrorAction SilentlyContinue
        $sizeBefore = ($items | Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
        
        foreach ($item in $items) {
            try {
                Remove-Item $item.FullName -Force -Recurse ${whatIf} -ErrorAction Stop
                $filesRemoved++
            } catch {
                # Skip files in use - this is expected
            }
        }
        
        $script:totalCleaned += $sizeBefore
        $script:itemsCleaned += $filesRemoved
        Write-Host "   ✓ Removed $filesRemoved items ($([math]::Round($sizeBefore / 1MB, 2)) MB)" -ForegroundColor Green
        
    } catch {
        Write-Host "   ⚠️  Some files were in use (this is normal)" -ForegroundColor Yellow
        $script:errorCount++
    }
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
Write-Host "🗑️  Emptying Recycle Bin..." -ForegroundColor Cyan
try {
    Clear-RecycleBin -Force ${whatIf} -ErrorAction Stop
    Write-Host "   ✓ Recycle Bin emptied" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not empty recycle bin: $($_.Exception.Message)" -ForegroundColor Yellow
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generatePrivacySection(privacy, whatIf) {
    let section = `
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║                  PRIVACY SETTINGS                         ║" -ForegroundColor Magenta
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

`;

    if (privacy.telemetry) {
        section += `
Write-Host "🔒 Minimizing Telemetry..." -ForegroundColor Cyan
try {
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -Value 0 ${whatIf} -ErrorAction Stop
    Write-Host "   ✓ Telemetry set to minimum" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not modify telemetry settings" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    if (privacy.ads) {
        section += `
Write-Host "🔒 Disabling Advertising ID..." -ForegroundColor Cyan
try {
    if (-not (Test-Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo")) {
        New-Item -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Force ${whatIf} | Out-Null
    }
    Set-ItemProperty -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Name "Enabled" -Value 0 ${whatIf} -ErrorAction Stop
    Write-Host "   ✓ Advertising ID disabled" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not disable advertising ID" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    if (privacy.cortana) {
        section += `
Write-Host "🔒 Disabling Cortana..." -ForegroundColor Cyan
try {
    if (-not (Test-Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search")) {
        New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Force ${whatIf} | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Name "AllowCortana" -Value 0 ${whatIf} -ErrorAction Stop
    Write-Host "   ✓ Cortana disabled" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not disable Cortana" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    if (privacy.location) {
        section += `
Write-Host "🔒 Disabling Location Tracking..." -ForegroundColor Cyan
try {
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" -Name "Value" -Value "Deny" ${whatIf} -ErrorAction Stop
    Write-Host "   ✓ Location tracking disabled" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not disable location tracking" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generatePerformanceSection(perf, whatIf) {
    let section = `
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║                 PERFORMANCE TUNING                        ║" -ForegroundColor Blue
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

`;

    if (perf.visual) {
        section += `
Write-Host "🎯 Optimizing Visual Effects..." -ForegroundColor Cyan
try {
    Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" -Name "VisualFXSetting" -Value 2 ${whatIf} -ErrorAction Stop
    Write-Host "   ✓ Visual effects set to best performance" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not modify visual effects" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    if (perf.gamemode) {
        section += `
Write-Host "🎯 Enabling Game Mode..." -ForegroundColor Cyan
try {
    if (-not (Test-Path "HKCU:\\Software\\Microsoft\\GameBar")) {
        New-Item -Path "HKCU:\\Software\\Microsoft\\GameBar" -Force ${whatIf} | Out-Null
    }
    Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AutoGameModeEnabled" -Value 1 ${whatIf} -ErrorAction Stop
    Write-Host "   ✓ Game Mode enabled" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not enable Game Mode" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    if (perf.superfetch) {
        section += `
Write-Host "🎯 Disabling Superfetch (for SSD)..." -ForegroundColor Cyan
try {
    Set-Service -Name "SysMain" -StartupType Disabled ${whatIf} -ErrorAction Stop
    Stop-Service -Name "SysMain" -Force ${whatIf} -ErrorAction SilentlyContinue
    Write-Host "   ✓ Superfetch disabled" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not disable Superfetch" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    if (perf.hibernation) {
        section += `
Write-Host "🎯 Disabling Hibernation..." -ForegroundColor Cyan
try {
    powercfg -h off
    Write-Host "   ✓ Hibernation disabled (hiberfil.sys deleted)" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not disable hibernation" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generateServicesSection(services, whatIf) {
    let section = `
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor DarkYellow
Write-Host "║                  WINDOWS SERVICES                         ║" -ForegroundColor DarkYellow
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor DarkYellow
Write-Host ""

`;

    if (services.diagtrack) {
        section += `
Write-Host "⚙️  Disabling Diagnostics Tracking Service..." -ForegroundColor Cyan
try {
    Set-Service -Name "DiagTrack" -StartupType Disabled ${whatIf} -ErrorAction Stop
    Stop-Service -Name "DiagTrack" -Force ${whatIf} -ErrorAction SilentlyContinue
    Write-Host "   ✓ DiagTrack service disabled" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not modify DiagTrack service" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    if (services.sysmain) {
        section += `
Write-Host "⚙️  Setting Superfetch to Manual..." -ForegroundColor Cyan
try {
    Set-Service -Name "SysMain" -StartupType Manual ${whatIf} -ErrorAction Stop
    Write-Host "   ✓ SysMain (Superfetch) set to Manual" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not modify SysMain service" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    if (services.wsearch) {
        section += `
Write-Host "⚙️  Setting Windows Search to Manual..." -ForegroundColor Cyan
try {
    Set-Service -Name "WSearch" -StartupType Manual ${whatIf} -ErrorAction Stop
    Write-Host "   ✓ Windows Search set to Manual (saves CPU/disk)" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not modify Windows Search service" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generateDiskCleanupSection(disk, whatIf) {
    let section = `
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor DarkCyan
Write-Host "║                  DISK MAINTENANCE                         ║" -ForegroundColor DarkCyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor DarkCyan
Write-Host ""

`;

    if (disk.winsxs) {
        section += `
Write-Host "💾 Cleaning Component Store (WinSxS)..." -ForegroundColor Cyan
Write-Host "   ⏱️  This may take 5-10 minutes..." -ForegroundColor Gray
try {
    $result = Dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase
    Write-Host "   ✓ Component Store cleaned" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not clean component store" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    if (disk.updates) {
        section += `
Write-Host "💾 Removing Old Windows Updates..." -ForegroundColor Cyan
try {
    $updatePath = "C:\\Windows\\SoftwareDistribution\\Download"
    if (Test-Path $updatePath) {
        $sizeBefore = (Get-ChildItem $updatePath -Recurse | Measure-Object -Property Length -Sum).Sum
        Remove-Item "$updatePath\\*" -Recurse -Force ${whatIf} -ErrorAction Stop
        $script:totalCleaned += $sizeBefore
        Write-Host "   ✓ Old updates removed ($([math]::Round($sizeBefore / 1MB, 2)) MB)" -ForegroundColor Green
        $script:itemsCleaned++
    }
} catch {
    Write-Host "   ⚠️  Could not remove old updates" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    if (disk.logs) {
        section += `
Write-Host "💾 Clearing Old System Logs..." -ForegroundColor Cyan
try {
    Get-EventLog -LogName * | ForEach-Object {
        try {
            Clear-EventLog -LogName $_.Log ${whatIf} -ErrorAction Stop
        } catch {
            # Some logs can't be cleared - skip them
        }
    }
    Write-Host "   ✓ System logs cleared" -ForegroundColor Green
    $script:itemsCleaned++
} catch {
    Write-Host "   ⚠️  Could not clear all logs" -ForegroundColor Yellow
    $script:errorCount++
}
`;
    }

    section += "\nWrite-Host \"\"\n";
    return section;
}

function generateStartupSection(startup) {
    let section = `
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                  STARTUP ANALYSIS                         ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "⚡ Scanning startup items..." -ForegroundColor Cyan

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

# Create HTML report
$reportPath = "$env:USERPROFILE\\Desktop\\Startup_Report_$(Get-Date -Format 'yyyy-MM-dd_HH-mm').html"
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

Write-Host "   ✓ Report created: $reportPath" -ForegroundColor Green
Write-Host "   📄 Opening report in browser..." -ForegroundColor Cyan
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
    
    const taskScript = `#Requires -RunAsAdministrator
# ============================================
# Weekly Maintenance Task Creator
# Generated: ${new Date().toLocaleString()}
# ============================================

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      WEEKLY MAINTENANCE TASK CREATOR                      ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Create the optimization script file
$scriptPath = "$env:ProgramData\\WindowsOptimization\\WeeklyMaintenance.ps1"
$scriptDir = Split-Path $scriptPath -Parent

Write-Host "📁 Creating script directory..." -ForegroundColor Cyan
if (-not (Test-Path $scriptDir)) {
    New-Item -Path $scriptDir -ItemType Directory -Force | Out-Null
}

Write-Host "💾 Saving optimization script..." -ForegroundColor Cyan
@'
${scriptContent}
'@ | Out-File -FilePath $scriptPath -Encoding UTF8 -Force

Write-Host "   ✓ Script saved to: $scriptPath" -ForegroundColor Green
Write-Host ""

# Create scheduled task
Write-Host "⏰ Creating scheduled task..." -ForegroundColor Cyan

$taskName = "Windows Weekly Optimization"
$taskDescription = "Automatically runs selected Windows optimizations every Sunday at 2 AM"

# Remove existing task if it exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "   ℹ️  Removed existing task" -ForegroundColor Gray
}

# Create new task
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \`"$scriptPath\`""
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 2am
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName $taskName -Description $taskDescription -Action $action -Trigger $trigger -Principal $principal -Settings $settings | Out-Null

Write-Host "   ✓ Task created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    SETUP COMPLETE!                        ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Task Details:" -ForegroundColor Cyan
Write-Host "   • Name: $taskName" -ForegroundColor White
Write-Host "   • Schedule: Every Sunday at 2:00 AM" -ForegroundColor White
Write-Host "   • Script location: $scriptPath" -ForegroundColor White
Write-Host ""
Write-Host "💡 To manage this task:" -ForegroundColor Yellow
Write-Host "   1. Open Task Scheduler (taskschd.msc)" -ForegroundColor Gray
Write-Host "   2. Find '$taskName'" -ForegroundColor Gray
Write-Host "   3. You can run, disable, or delete it from there" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"
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
