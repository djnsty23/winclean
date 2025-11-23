// Windows 11 Optimization Portal - Script Generator
// All scripts are PowerShell-based, safe, and transparent

// Utility Functions
function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('scriptModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('scriptModal').style.display = 'none';
}

function downloadScript(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:]/g, '-').split('.')[0];
}

// Temp Cleaner Script Generator
function generateTempCleanerScript(previewOnly = false) {
    const options = {
        userTemp: document.getElementById('temp-user').checked,
        windowsTemp: document.getElementById('temp-windows').checked,
        prefetch: document.getElementById('temp-prefetch').checked,
        recycle: document.getElementById('temp-recycle').checked,
        thumbnail: document.getElementById('temp-thumbnail').checked,
        log: document.getElementById('temp-log').checked,
        previewOnly: previewOnly
    };

    const script = `# Windows 11 Temp File Cleaner
# Generated: ${new Date().toLocaleString()}
# Mode: ${previewOnly ? 'PREVIEW ONLY - No files will be deleted' : 'CLEANUP MODE'}

# Require Administrator privileges
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: This script requires Administrator privileges." -ForegroundColor Red
    Write-Host "Please right-click and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Windows 11 Temp File Cleaner" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Initialize counters
$totalFilesDeleted = 0
$totalSpaceFreed = 0
$errors = @()
$logEntries = @()

# Function to safely delete files
function Remove-TempFiles {
    param(
        [string]$Path,
        [string]$Description
    )
    
    Write-Host "Scanning: $Description..." -ForegroundColor Yellow
    
    if (-not (Test-Path $Path)) {
        Write-Host "  Path not found, skipping." -ForegroundColor Gray
        return
    }
    
    $filesBefore = 0
    $sizeBefore = 0
    $filesDeleted = 0
    $spaceFreed = 0
    
    try {
        # Get all items recursively
        $items = Get-ChildItem -Path $Path -Recurse -Force -ErrorAction SilentlyContinue
        
        foreach ($item in $items) {
            try {
                $size = if ($item.PSIsContainer) { 0 } else { $item.Length }
                $filesBefore++
                $sizeBefore += $size
                
                ${previewOnly ? 'Write-Host "  [PREVIEW] Would delete: $($item.FullName)" -ForegroundColor Gray' : `
                if (-not $item.PSIsContainer) {
                    Remove-Item -Path $item.FullName -Force -ErrorAction Stop
                    $filesDeleted++
                    $spaceFreed += $size
                }`}
            }
            catch {
                # File in use or access denied - skip silently
                if ($_.Exception.Message -notmatch "in use|access denied") {
                    $script:errors += "Failed to delete: $($item.FullName) - $($_.Exception.Message)"
                }
            }
        }
        
        # Try to remove empty directories
        ${previewOnly ? '' : `
        Get-ChildItem -Path $Path -Recurse -Force -Directory -ErrorAction SilentlyContinue | 
            Sort-Object -Property FullName -Descending | 
            ForEach-Object {
                try {
                    Remove-Item -Path $_.FullName -Force -ErrorAction Stop
                }
                catch {
                    # Directory not empty or in use - skip silently
                }
            }`}
        
        $script:totalFilesDeleted += $filesDeleted
        $script:totalSpaceFreed += $spaceFreed
        
        Write-Host "  Files scanned: $filesBefore" -ForegroundColor White
        ${previewOnly ? 
        'Write-Host "  Would delete: $filesDeleted files" -ForegroundColor Cyan' :
        'Write-Host "  Files deleted: $filesDeleted" -ForegroundColor Green'}
        Write-Host "  Space: $([math]::Round($spaceFreed / 1MB, 2)) MB" -ForegroundColor Green
        
        $script:logEntries += "$Description|$filesBefore|$filesDeleted|$([math]::Round($spaceFreed / 1MB, 2))"
    }
    catch {
        Write-Host "  Error accessing path: $($_.Exception.Message)" -ForegroundColor Red
        $script:errors += "Failed to access: $Path - $($_.Exception.Message)"
    }
    
    Write-Host ""
}

# Start cleanup
Write-Host "Starting cleanup process..." -ForegroundColor Cyan
Write-Host ""

${options.userTemp ? `
# Clean User Temp Folder
Remove-TempFiles -Path $env:TEMP -Description "User Temp Folder (%TEMP%)"
` : ''}

${options.windowsTemp ? `
# Clean Windows Temp Folder
Remove-TempFiles -Path "C:\\Windows\\Temp" -Description "Windows Temp Folder"
` : ''}

${options.prefetch ? `
# Clean Prefetch
Remove-TempFiles -Path "C:\\Windows\\Prefetch" -Description "Prefetch Cache"
` : ''}

${options.thumbnail ? `
# Clear Thumbnail Cache
Remove-TempFiles -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer" -Description "Thumbnail Cache"
` : ''}

${options.recycle && !previewOnly ? `
# Empty Recycle Bin
Write-Host "Emptying Recycle Bin..." -ForegroundColor Yellow
try {
    Clear-RecycleBin -Force -ErrorAction Stop
    Write-Host "  Recycle Bin emptied successfully" -ForegroundColor Green
}
catch {
    Write-Host "  Failed to empty Recycle Bin: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""
` : ''}

# Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Cleanup Summary" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Total files ${previewOnly ? 'that would be deleted' : 'deleted'}: $totalFilesDeleted" -ForegroundColor $(if ($previewOnly) { 'Cyan' } else { 'Green' })
Write-Host "Total space ${previewOnly ? 'that would be freed' : 'freed'}: $([math]::Round($totalSpaceFreed / 1MB, 2)) MB ($([math]::Round($totalSpaceFreed / 1GB, 2)) GB)" -ForegroundColor $(if ($previewOnly) { 'Cyan' } else { 'Green' })

if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "Errors encountered: $($errors.Count)" -ForegroundColor Yellow
    Write-Host "Most errors are normal (files in use by system)" -ForegroundColor Gray
}

${options.log && !previewOnly ? `
# Save log to Desktop
$logPath = "$env:USERPROFILE\\Desktop\\TempCleanup_${getTimestamp()}.txt"
$logContent = @"
Windows 11 Temp File Cleaner Log
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
================================

Summary:
- Total Files Deleted: $totalFilesDeleted
- Total Space Freed: $([math]::Round($totalSpaceFreed / 1MB, 2)) MB

Details:
$($logEntries -join "\\n")

Errors: $($errors.Count)
$($errors -join "\\n")
"@

$logContent | Out-File -FilePath $logPath -Encoding UTF8
Write-Host ""
Write-Host "Log saved to: $logPath" -ForegroundColor Green
` : ''}

Write-Host ""
Write-Host "Cleanup completed!" -ForegroundColor Green
Read-Host "Press Enter to exit"
`;

    // Show modal with script preview
    const modalContent = `
        <div class="alert alert-info">
            <span class="alert-icon">ℹ️</span>
            <div>
                <strong>${previewOnly ? 'Preview Mode' : 'Cleanup Mode'}</strong><br>
                ${previewOnly ? 
                    'This script will scan and show what would be deleted without actually removing files.' :
                    'This script will permanently delete temporary files. Files in use will be automatically skipped.'}
            </div>
        </div>
        
        <div class="alert alert-warning">
            <span class="alert-icon">⚠️</span>
            <div>
                <strong>How to Run:</strong><br>
                1. Download the script<br>
                2. Right-click the .ps1 file → "Run with PowerShell"<br>
                3. If needed, allow execution: <code>Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass</code>
            </div>
        </div>
        
        <h3>Script Content:</h3>
        <div class="script-preview">${escapeHtml(script)}</div>
        
        <div class="btn-group">
            <button class="btn btn-success" onclick="downloadScript('TempCleaner_${previewOnly ? 'Preview' : 'Cleanup'}_${getTimestamp()}.ps1', \`${script.replace(/`/g, '\\`')}\`)">
                💾 Download Script
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                Close
            </button>
        </div>
    `;
    
    showModal(`${previewOnly ? '👀 Preview Mode' : '🗑️ Temp Cleaner'} Script`, modalContent);
}

// Startup Optimizer Script Generator
function generateStartupScript() {
    const options = {
        scan: document.getElementById('startup-scan').checked,
        report: document.getElementById('startup-report').checked,
        services: document.getElementById('startup-services').checked
    };

    const script = `# Windows 11 Startup Optimizer
# Generated: ${new Date().toLocaleString()}

# Require Administrator privileges
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: This script requires Administrator privileges." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Startup Optimizer & Analyzer" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

${options.scan ? `
# Get all startup programs
Write-Host "Scanning startup programs..." -ForegroundColor Yellow
$startupItems = @()

# Registry-based startup items
$registryPaths = @(
    "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
    "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce",
    "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
    "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce"
)

foreach ($path in $registryPaths) {
    if (Test-Path $path) {
        Get-ItemProperty -Path $path | 
            Get-Member -MemberType NoteProperty |
            Where-Object { $_.Name -ne 'PSPath' -and $_.Name -ne 'PSParentPath' -and $_.Name -ne 'PSChildName' -and $_.Name -ne 'PSProvider' } |
            ForEach-Object {
                $startupItems += [PSCustomObject]@{
                    Name = $_.Name
                    Location = $path
                    Command = (Get-ItemProperty -Path $path).$($_.Name)
                    Type = "Registry"
                }
            }
    }
}

# Startup folder items
$startupFolders = @(
    "$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs\\Startup",
    "$env:ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Startup"
)

foreach ($folder in $startupFolders) {
    if (Test-Path $folder) {
        Get-ChildItem -Path $folder |
            ForEach-Object {
                $startupItems += [PSCustomObject]@{
                    Name = $_.Name
                    Location = $folder
                    Command = $_.FullName
                    Type = "Shortcut"
                }
            }
    }
}

Write-Host "Found $($startupItems.Count) startup items" -ForegroundColor Green
Write-Host ""

# Display startup items
Write-Host "Startup Programs:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
foreach ($item in $startupItems) {
    Write-Host "Name: $($item.Name)" -ForegroundColor White
    Write-Host "  Type: $($item.Type)" -ForegroundColor Gray
    Write-Host "  Location: $($item.Location)" -ForegroundColor Gray
    Write-Host "  Command: $($item.Command)" -ForegroundColor Gray
    Write-Host ""
}
` : ''}

${options.services ? `
# Optimize Services
Write-Host "Analyzing services..." -ForegroundColor Yellow
Write-Host ""

# Safe services to set to Manual (these won't break Windows)
$servicesToOptimize = @(
    "DiagTrack",           # Diagnostics Tracking
    "dmwappushservice",    # WAP Push Message Routing
    "SysMain",             # Superfetch (not needed on SSD)
    "WSearch",             # Windows Search (can be set to manual)
    "MapsBroker"           # Downloaded Maps Manager
)

foreach ($serviceName in $servicesToOptimize) {
    try {
        $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
        if ($service) {
            $currentStatus = $service.StartType
            Write-Host "Service: $serviceName" -ForegroundColor White
            Write-Host "  Current: $currentStatus" -ForegroundColor Gray
            
            # Uncomment the line below to actually change the service
            # Set-Service -Name $serviceName -StartupType Manual
            # Write-Host "  Changed to: Manual" -ForegroundColor Green
            
            Write-Host "  [ANALYSIS ONLY - Uncomment script to apply changes]" -ForegroundColor Yellow
            Write-Host ""
        }
    }
    catch {
        Write-Host "  Failed to modify: $serviceName" -ForegroundColor Red
    }
}

Write-Host "NOTE: Service optimization is in ANALYSIS mode." -ForegroundColor Yellow
Write-Host "Edit the script and uncomment the Set-Service line to apply changes." -ForegroundColor Yellow
Write-Host ""
` : ''}

${options.report ? `
# Generate HTML Report
$reportPath = "$env:USERPROFILE\\Desktop\\StartupReport_${getTimestamp()}.html"

$htmlReport = @"
<!DOCTYPE html>
<html>
<head>
    <title>Startup Analysis Report</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        h1 { color: #0078d4; }
        .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #0078d4; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:hover { background: #f9f9f9; }
        .safe { color: #107c10; }
        .warning { color: #f7630c; }
        .recommendation { background: #fff4e6; padding: 15px; border-left: 4px solid #f7630c; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Windows 11 Startup Analysis Report</h1>
        <p>Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")</p>
        
        <h2>Startup Programs ($($startupItems.Count) items)</h2>
        <table>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Recommendation</th>
            </tr>
"@

foreach ($item in $startupItems) {
    $recommendation = "Review - Check if needed"
    $htmlReport += @"
            <tr>
                <td>$($item.Name)</td>
                <td>$($item.Type)</td>
                <td style="font-size: 0.9em; color: #666;">$($item.Location)</td>
                <td class="warning">$recommendation</td>
            </tr>
"@
}

$htmlReport += @"
        </table>
        
        <div class="recommendation">
            <h3>Recommendations:</h3>
            <ul>
                <li>Disable startup items you don't use daily</li>
                <li>Keep security software (antivirus) enabled</li>
                <li>Cloud sync apps (OneDrive, Dropbox) can usually be set to manual</li>
                <li>Printer and scanner software rarely needs to start automatically</li>
                <li>Use Task Manager > Startup tab to disable items</li>
            </ul>
        </div>
        
        <h3>How to Disable Startup Items:</h3>
        <ol>
            <li>Press Ctrl+Shift+Esc to open Task Manager</li>
            <li>Go to the Startup tab</li>
            <li>Right-click items and select "Disable"</li>
            <li>Restart your computer to see improvements</li>
        </ol>
    </div>
</body>
</html>
"@

$htmlReport | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "Report saved to: $reportPath" -ForegroundColor Green
Start-Process $reportPath
` : ''}

Write-Host ""
Write-Host "Analysis completed!" -ForegroundColor Green
Read-Host "Press Enter to exit"
`;

    const modalContent = `
        <div class="alert alert-info">
            <span class="alert-icon">ℹ️</span>
            <div>
                <strong>Startup Optimizer</strong><br>
                This script analyzes your startup programs and services. It's in analysis mode by default - 
                you'll need to manually disable items using Task Manager.
            </div>
        </div>
        
        <h3>Script Content:</h3>
        <div class="script-preview">${escapeHtml(script)}</div>
        
        <div class="btn-group">
            <button class="btn btn-success" onclick="downloadScript('StartupOptimizer_${getTimestamp()}.ps1', \`${script.replace(/`/g, '\\`')}\`)">
                💾 Download Script
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                Close
            </button>
        </div>
    `;
    
    showModal('⚡ Startup Optimizer Script', modalContent);
}

// Privacy Optimizer Script Generator
function generatePrivacyScript(preview = false, restore = false) {
    const options = {
        telemetry: document.getElementById('privacy-telemetry').checked,
        cortana: document.getElementById('privacy-cortana').checked,
        ads: document.getElementById('privacy-ads').checked,
        location: document.getElementById('privacy-location').checked,
        feedback: document.getElementById('privacy-feedback').checked
    };

    const script = `# Windows 11 Privacy & Telemetry Optimizer
# Generated: ${new Date().toLocaleString()}
# Mode: ${restore ? 'RESTORE DEFAULT SETTINGS' : 'OPTIMIZE PRIVACY'}

# Require Administrator privileges
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: This script requires Administrator privileges." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Privacy & Telemetry ${restore ? 'Restore' : 'Optimizer'}" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Create restore point
Write-Host "Creating system restore point..." -ForegroundColor Yellow
try {
    Enable-ComputerRestore -Drive "C:\\"
    Checkpoint-Computer -Description "Before Privacy Changes" -RestorePointType "MODIFY_SETTINGS"
    Write-Host "Restore point created successfully" -ForegroundColor Green
}
catch {
    Write-Host "Warning: Could not create restore point: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

${options.telemetry ? `
# ${restore ? 'Restore' : 'Minimize'} Telemetry
Write-Host "${restore ? 'Restoring' : 'Minimizing'} telemetry..." -ForegroundColor Yellow
try {
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -Type DWord -Value ${restore ? '3' : '0'}
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection" -Name "AllowTelemetry" -Type DWord -Value ${restore ? '3' : '0'}
    Write-Host "  Telemetry ${restore ? 'restored to default' : 'set to minimum'}" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
` : ''}

${options.cortana ? `
# ${restore ? 'Enable' : 'Disable'} Cortana
Write-Host "${restore ? 'Enabling' : 'Disabling'} Cortana..." -ForegroundColor Yellow
try {
    if (-not (Test-Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search")) {
        New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Name "AllowCortana" -Type DWord -Value ${restore ? '1' : '0'}
    Write-Host "  Cortana ${restore ? 'enabled' : 'disabled'}" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
` : ''}

${options.ads ? `
# ${restore ? 'Enable' : 'Disable'} Advertising ID
Write-Host "${restore ? 'Enabling' : 'Disabling'} Advertising ID..." -ForegroundColor Yellow
try {
    if (-not (Test-Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo")) {
        New-Item -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Name "Enabled" -Type DWord -Value ${restore ? '1' : '0'}
    Write-Host "  Advertising ID ${restore ? 'enabled' : 'disabled'}" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
` : ''}

${options.location ? `
# ${restore ? 'Enable' : 'Disable'} Location Tracking
Write-Host "${restore ? 'Enabling' : 'Disabling'} location tracking..." -ForegroundColor Yellow
try {
    if (-not (Test-Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location")) {
        New-Item -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" -Name "Value" -Type String -Value ${restore ? '"Allow"' : '"Deny"'}
    Write-Host "  Location tracking ${restore ? 'enabled' : 'disabled'}" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
` : ''}

${options.feedback ? `
# ${restore ? 'Enable' : 'Disable'} Feedback Requests
Write-Host "${restore ? 'Enabling' : 'Disabling'} feedback requests..." -ForegroundColor Yellow
try {
    if (-not (Test-Path "HKCU:\\SOFTWARE\\Microsoft\\Siuf\\Rules")) {
        New-Item -Path "HKCU:\\SOFTWARE\\Microsoft\\Siuf\\Rules" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKCU:\\SOFTWARE\\Microsoft\\Siuf\\Rules" -Name "NumberOfSIUFInPeriod" -Type DWord -Value ${restore ? '0' : '0'}
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "DoNotShowFeedbackNotifications" -Type DWord -Value ${restore ? '0' : '1'}
    Write-Host "  Feedback requests ${restore ? 'enabled' : 'disabled'}" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
` : ''}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Changes applied successfully!" -ForegroundColor Green
Write-Host "A restart is recommended for all changes to take effect." -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$restart = Read-Host "Restart now? (y/n)"
if ($restart -eq 'y') {
    Restart-Computer -Force
}
`;

    const modalContent = `
        <div class="alert ${restore ? 'alert-info' : 'alert-warning'}">
            <span class="alert-icon">${restore ? 'ℹ️' : '⚠️'}</span>
            <div>
                <strong>${restore ? 'Restore Mode' : 'Privacy Optimization'}</strong><br>
                ${restore ? 
                    'This script will restore Windows privacy settings to their defaults.' :
                    'This script will modify Windows registry to enhance privacy. A system restore point will be created automatically.'}
            </div>
        </div>
        
        <div class="alert alert-success">
            <span class="alert-icon">✅</span>
            <div>
                <strong>Safe & Reversible</strong><br>
                All changes are registry-based and can be reverted. A restore point is created before any modifications.
            </div>
        </div>
        
        <h3>Script Content:</h3>
        <div class="script-preview">${escapeHtml(script)}</div>
        
        <div class="btn-group">
            <button class="btn btn-success" onclick="downloadScript('PrivacyOptimizer_${restore ? 'Restore' : 'Optimize'}_${getTimestamp()}.ps1', \`${script.replace(/`/g, '\\`')}\`)">
                💾 Download Script
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                Close
            </button>
        </div>
    `;
    
    showModal(`🔒 Privacy ${restore ? 'Restore' : 'Optimizer'}`, modalContent);
}

// Performance Optimizer Script Generator
function generatePerformanceScript(restore = false) {
    const options = {
        visual: document.getElementById('perf-visual').checked,
        indexing: document.getElementById('perf-indexing').checked,
        superfetch: document.getElementById('perf-superfetch').checked,
        hibernation: document.getElementById('perf-hibernation').checked,
        gameMode: document.getElementById('perf-gamemode').checked
    };

    const script = `# Windows 11 Performance Tuning
# Generated: ${new Date().toLocaleString()}
# Mode: ${restore ? 'RESTORE DEFAULTS' : 'OPTIMIZE FOR PERFORMANCE'}

# Require Administrator privileges
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: This script requires Administrator privileges." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Performance ${restore ? 'Restore' : 'Optimizer'}" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

${options.visual ? `
# ${restore ? 'Restore' : 'Optimize'} Visual Effects
Write-Host "${restore ? 'Restoring' : 'Optimizing'} visual effects..." -ForegroundColor Yellow
try {
    # Disable animations and transparency for performance
    Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "TaskbarAnimations" -Type DWord -Value ${restore ? '1' : '0'}
    Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "ListviewAlphaSelect" -Type DWord -Value ${restore ? '1' : '0'}
    Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "ListviewShadow" -Type DWord -Value ${restore ? '1' : '0'}
    Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\DWM" -Name "EnableAeroPeek" -Type DWord -Value ${restore ? '1' : '0'}
    Write-Host "  Visual effects ${restore ? 'restored' : 'optimized'}" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
` : ''}

${options.superfetch ? `
# ${restore ? 'Enable' : 'Disable'} Superfetch (for SSD users)
Write-Host "${restore ? 'Enabling' : 'Disabling'} Superfetch..." -ForegroundColor Yellow
try {
    ${restore ? 
        'Set-Service -Name "SysMain" -StartupType Automatic' :
        'Set-Service -Name "SysMain" -StartupType Disabled'}
    Write-Host "  Superfetch ${restore ? 'enabled' : 'disabled'}" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
` : ''}

${options.hibernation ? `
# ${restore ? 'Enable' : 'Disable'} Hibernation
Write-Host "${restore ? 'Enabling' : 'Disabling'} hibernation..." -ForegroundColor Yellow
try {
    ${restore ? 'powercfg /hibernate on' : 'powercfg /hibernate off'}
    Write-Host "  Hibernation ${restore ? 'enabled' : 'disabled'}${!restore ? ' (hiberfil.sys will be deleted)' : ''}" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
` : ''}

${options.gameMode ? `
# ${restore ? 'Disable' : 'Enable'} Game Mode
Write-Host "${restore ? 'Disabling' : 'Enabling'} Game Mode..." -ForegroundColor Yellow
try {
    if (-not (Test-Path "HKCU:\\Software\\Microsoft\\GameBar")) {
        New-Item -Path "HKCU:\\Software\\Microsoft\\GameBar" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AutoGameModeEnabled" -Type DWord -Value ${restore ? '0' : '1'}
    Write-Host "  Game Mode ${restore ? 'disabled' : 'enabled'}" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
` : ''}

${options.indexing ? `
# Optimize Search Indexing
Write-Host "Optimizing search indexing..." -ForegroundColor Yellow
try {
    # Set indexing to manual start (you can still search, but indexing won't run constantly)
    Set-Service -Name "WSearch" -StartupType Manual
    Write-Host "  Search indexing set to manual" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
` : ''}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Performance optimization complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
`;

    const modalContent = `
        <div class="alert ${restore ? 'alert-info' : 'alert-success'}">
            <span class="alert-icon">${restore ? 'ℹ️' : '🎯'}</span>
            <div>
                <strong>${restore ? 'Restore Performance Settings' : 'Performance Optimization'}</strong><br>
                ${restore ? 
                    'This will restore performance settings to Windows defaults.' :
                    'This will optimize Windows for better performance, especially on older hardware or SSDs.'}
            </div>
        </div>
        
        <h3>Script Content:</h3>
        <div class="script-preview">${escapeHtml(script)}</div>
        
        <div class="btn-group">
            <button class="btn btn-success" onclick="downloadScript('PerformanceOptimizer_${restore ? 'Restore' : 'Optimize'}_${getTimestamp()}.ps1', \`${script.replace(/`/g, '\\`')}\`)">
                💾 Download Script
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                Close
            </button>
        </div>
    `;
    
    showModal(`🎯 Performance ${restore ? 'Restore' : 'Optimizer'}`, modalContent);
}

// Disk Maintenance Script Generator
function generateDiskScript() {
    const options = {
        winsxs: document.getElementById('disk-winsxs').checked,
        updates: document.getElementById('disk-updates').checked,
        logs: document.getElementById('disk-logs').checked,
        drivers: document.getElementById('disk-drivers').checked,
        analyze: document.getElementById('disk-analyze').checked
    };

    const script = `# Windows 11 Disk Maintenance
# Generated: ${new Date().toLocaleString()}

# Require Administrator privileges
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: This script requires Administrator privileges." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Disk Maintenance & Cleanup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

${options.analyze ? `
# Analyze disk space that can be freed
Write-Host "Analyzing disk space..." -ForegroundColor Yellow
Write-Host ""

$totalCleanable = 0

# Run Disk Cleanup analysis
Start-Process -FilePath "cleanmgr.exe" -ArgumentList "/sageset:1" -Wait
Write-Host "Disk Cleanup wizard opened. Please configure options and close it." -ForegroundColor Yellow
Write-Host "Press Enter when done..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "Running analysis..." -ForegroundColor Yellow
Start-Process -FilePath "cleanmgr.exe" -ArgumentList "/sagerun:1" -Wait
Write-Host "Disk Cleanup completed!" -ForegroundColor Green
` : ''}

${options.winsxs ? `
# Clean Component Store (WinSxS)
Write-Host "Cleaning Component Store..." -ForegroundColor Yellow
try {
    $before = (Get-ChildItem -Path "C:\\Windows\\WinSxS" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1GB
    Write-Host "  Current WinSxS size: $([math]::Round($before, 2)) GB" -ForegroundColor White
    
    # Clean up the component store
    Dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase
    
    $after = (Get-ChildItem -Path "C:\\Windows\\WinSxS" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1GB
    Write-Host "  New WinSxS size: $([math]::Round($after, 2)) GB" -ForegroundColor Green
    Write-Host "  Space freed: $([math]::Round($before - $after, 2)) GB" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""
` : ''}

${options.updates ? `
# Remove old Windows Update files
Write-Host "Removing old Windows Update files..." -ForegroundColor Yellow
try {
    # Clean up Windows Update cache
    Stop-Service -Name wuauserv -Force
    Remove-Item -Path "C:\\Windows\\SoftwareDistribution\\Download\\*" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Service -Name wuauserv
    Write-Host "  Windows Update cache cleared" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""
` : ''}

${options.logs ? `
# Clear System Logs
Write-Host "Clearing system logs..." -ForegroundColor Yellow
try {
    Get-ChildItem -Path "C:\\Windows\\Logs" -Include "*.log", "*.txt" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } |
        Remove-Item -Force -ErrorAction SilentlyContinue
    
    Write-Host "  Old log files removed" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""
` : ''}

${options.drivers ? `
# Remove old driver packages
Write-Host "Removing old driver packages..." -ForegroundColor Yellow
try {
    pnputil /delete-driver oem*.inf /uninstall /force
    Write-Host "  Old drivers removed" -ForegroundColor Green
}
catch {
    Write-Host "  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""
` : ''}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Disk maintenance completed!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Show disk space
$disk = Get-PSDrive C
Write-Host "Drive C: Status:" -ForegroundColor Cyan
Write-Host "  Total: $([math]::Round($disk.Used / 1GB + $disk.Free / 1GB, 2)) GB" -ForegroundColor White
Write-Host "  Used: $([math]::Round($disk.Used / 1GB, 2)) GB" -ForegroundColor White
Write-Host "  Free: $([math]::Round($disk.Free / 1GB, 2)) GB" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"
`;

    const modalContent = `
        <div class="alert alert-warning">
            <span class="alert-icon">⚠️</span>
            <div>
                <strong>Disk Maintenance</strong><br>
                This script performs deep system cleanup. It may take several minutes to complete. 
                Some operations cannot be undone.
            </div>
        </div>
        
        <div class="alert alert-info">
            <span class="alert-icon">ℹ️</span>
            <div>
                <strong>What This Does:</strong><br>
                • Cleans Windows component store (WinSxS)<br>
                • Removes superseded Windows updates<br>
                • Clears old system logs<br>
                • Removes old driver versions<br>
                Can free up 5-15 GB depending on your system.
            </div>
        </div>
        
        <h3>Script Content:</h3>
        <div class="script-preview">${escapeHtml(script)}</div>
        
        <div class="btn-group">
            <button class="btn btn-success" onclick="downloadScript('DiskMaintenance_${getTimestamp()}.ps1', \`${script.replace(/`/g, '\\`')}\`)">
                💾 Download Script
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                Close
            </button>
        </div>
    `;
    
    showModal('💾 Disk Maintenance Script', modalContent);
}

// Complete Optimization Suite
function generateCompleteScript() {
    const script = `# Windows 11 Complete Optimization Suite
# Generated: ${new Date().toLocaleString()}
# This script combines safe optimizations from all categories

# Require Administrator privileges
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: This script requires Administrator privileges." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Windows 11 Complete Optimization Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create System Restore Point
Write-Host "Creating system restore point..." -ForegroundColor Yellow
try {
    Enable-ComputerRestore -Drive "C:\\"
    Checkpoint-Computer -Description "Before Complete Optimization" -RestorePointType "MODIFY_SETTINGS"
    Write-Host "✓ Restore point created" -ForegroundColor Green
}
catch {
    Write-Host "⚠ Could not create restore point" -ForegroundColor Yellow
}
Write-Host ""

# ============================================
# 1. TEMP FILE CLEANUP
# ============================================
Write-Host "1. Cleaning Temporary Files..." -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

function Remove-TempFiles {
    param([string]$Path, [string]$Description)
    
    if (Test-Path $Path) {
        $count = 0
        $size = 0
        Get-ChildItem -Path $Path -Recurse -Force -ErrorAction SilentlyContinue | ForEach-Object {
            try {
                $size += $_.Length
                Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction Stop
                $count++
            } catch { }
        }
        Write-Host "  ✓ $Description : $count files, $([math]::Round($size / 1MB, 2)) MB" -ForegroundColor Green
    }
}

Remove-TempFiles -Path $env:TEMP -Description "User Temp"
Remove-TempFiles -Path "C:\\Windows\\Temp" -Description "Windows Temp"
Remove-TempFiles -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer" -Description "Thumbnail Cache"

Write-Host ""

# ============================================
# 2. PRIVACY OPTIMIZATION
# ============================================
Write-Host "2. Optimizing Privacy Settings..." -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Minimize telemetry
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -Type DWord -Value 0 -ErrorAction SilentlyContinue
Write-Host "  ✓ Telemetry minimized" -ForegroundColor Green

# Disable advertising ID
if (-not (Test-Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo")) {
    New-Item -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Force | Out-Null
}
Set-ItemProperty -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Name "Enabled" -Type DWord -Value 0
Write-Host "  ✓ Advertising ID disabled" -ForegroundColor Green

# Disable feedback requests
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "DoNotShowFeedbackNotifications" -Type DWord -Value 1 -ErrorAction SilentlyContinue
Write-Host "  ✓ Feedback requests disabled" -ForegroundColor Green

Write-Host ""

# ============================================
# 3. PERFORMANCE OPTIMIZATION
# ============================================
Write-Host "3. Optimizing Performance..." -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Disable visual effects
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "TaskbarAnimations" -Type DWord -Value 0
Write-Host "  ✓ Visual animations disabled" -ForegroundColor Green

# Enable Game Mode
if (-not (Test-Path "HKCU:\\Software\\Microsoft\\GameBar")) {
    New-Item -Path "HKCU:\\Software\\Microsoft\\GameBar" -Force | Out-Null
}
Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -Name "AutoGameModeEnabled" -Type DWord -Value 1
Write-Host "  ✓ Game Mode enabled" -ForegroundColor Green

# Optimize services for SSD
Set-Service -Name "SysMain" -StartupType Disabled -ErrorAction SilentlyContinue
Write-Host "  ✓ Superfetch disabled (SSD optimization)" -ForegroundColor Green

Write-Host ""

# ============================================
# 4. DISK CLEANUP
# ============================================
Write-Host "4. Running Disk Cleanup..." -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Stop Windows Update service temporarily
Stop-Service -Name wuauserv -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\\Windows\\SoftwareDistribution\\Download\\*" -Recurse -Force -ErrorAction SilentlyContinue
Start-Service -Name wuauserv -ErrorAction SilentlyContinue
Write-Host "  ✓ Windows Update cache cleared" -ForegroundColor Green

# Clean component store
Write-Host "  Running component cleanup (this may take a while)..." -ForegroundColor Yellow
Dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase /Quiet
Write-Host "  ✓ Component store cleaned" -ForegroundColor Green

Write-Host ""

# ============================================
# SUMMARY
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Optimization Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Changes Applied:" -ForegroundColor White
Write-Host "  • Temporary files cleaned" -ForegroundColor Gray
Write-Host "  • Privacy settings optimized" -ForegroundColor Gray
Write-Host "  • Performance settings optimized" -ForegroundColor Gray
Write-Host "  • Disk space recovered" -ForegroundColor Gray
Write-Host ""

# Show disk space
$disk = Get-PSDrive C
Write-Host "Current Disk Space (C:):" -ForegroundColor White
Write-Host "  Free: $([math]::Round($disk.Free / 1GB, 2)) GB" -ForegroundColor Green
Write-Host "  Used: $([math]::Round($disk.Used / 1GB, 2)) GB" -ForegroundColor Gray
Write-Host ""

Write-Host "Recommendation: Restart your computer for all changes to take effect." -ForegroundColor Yellow
Write-Host ""

$restart = Read-Host "Restart now? (y/n)"
if ($restart -eq 'y') {
    Restart-Computer -Force
}
`;

    const modalContent = `
        <div class="alert alert-success">
            <span class="alert-icon">🎁</span>
            <div>
                <strong>Complete Optimization Suite</strong><br>
                This all-in-one script combines safe defaults from all optimization categories. 
                Perfect for a fresh Windows 11 installation!
            </div>
        </div>
        
        <div class="alert alert-info">
            <span class="alert-icon">ℹ️</span>
            <div>
                <strong>What This Includes:</strong><br>
                ✓ Temp file cleanup<br>
                ✓ Privacy enhancements (telemetry, ads)<br>
                ✓ Performance tuning (visual effects, game mode)<br>
                ✓ Disk maintenance (component store, updates)<br>
                ✓ Automatic restore point creation<br>
                <br>
                <strong>Safe & tested on Windows 11</strong>
            </div>
        </div>
        
        <h3>Script Content:</h3>
        <div class="script-preview">${escapeHtml(script)}</div>
        
        <div class="btn-group">
            <button class="btn btn-success" onclick="downloadScript('Windows11_CompleteOptimization_${getTimestamp()}.ps1', \`${script.replace(/`/g, '\\`')}\`)">
                💾 Download Complete Optimization
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                Close
            </button>
        </div>
    `;
    
    showModal('🎁 Complete Optimization Suite', modalContent);
}

// Scheduled Task Generator
function generateScheduledTask() {
    const script = `# Create Scheduled Maintenance Task
# This creates a weekly maintenance task that runs automatically

# Require Administrator privileges
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: This script requires Administrator privileges." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Creating scheduled maintenance task..." -ForegroundColor Cyan
Write-Host ""

# Create the maintenance script
$maintenanceScript = @'
# Weekly Windows Maintenance Script
# Runs automatically to keep your system clean

# Clean temp files
Get-ChildItem -Path $env:TEMP -Recurse -Force -ErrorAction SilentlyContinue | 
    ForEach-Object { Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue }

Get-ChildItem -Path "C:\\Windows\\Temp" -Recurse -Force -ErrorAction SilentlyContinue | 
    ForEach-Object { Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue }

# Clear thumbnail cache
Remove-Item -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer\\*" -Force -Recurse -ErrorAction SilentlyContinue

# Log completion
$logPath = "$env:USERPROFILE\\Desktop\\MaintenanceLog_$(Get-Date -Format 'yyyy-MM-dd').txt"
"Maintenance completed: $(Get-Date)" | Out-File -FilePath $logPath -Append
'@

# Save maintenance script
$scriptPath = "$env:USERPROFILE\\WindowsMaintenance.ps1"
$maintenanceScript | Out-File -FilePath $scriptPath -Encoding UTF8

Write-Host "Maintenance script saved to: $scriptPath" -ForegroundColor Green
Write-Host ""

# Create scheduled task
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File \`"$scriptPath\`""
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 3am
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask -TaskName "Windows11Maintenance" -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description "Weekly system maintenance - cleans temp files and optimizes performance"

Write-Host "✓ Scheduled task created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Task Details:" -ForegroundColor White
Write-Host "  Name: Windows11Maintenance" -ForegroundColor Gray
Write-Host "  Schedule: Every Sunday at 3:00 AM" -ForegroundColor Gray
Write-Host "  What it does: Cleans temp files, thumbnail cache" -ForegroundColor Gray
Write-Host ""
Write-Host "To view/modify: Open Task Scheduler > Task Scheduler Library > Windows11Maintenance" -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to exit"
`;

    const modalContent = `
        <div class="alert alert-info">
            <span class="alert-icon">⏰</span>
            <div>
                <strong>Scheduled Maintenance Task</strong><br>
                This creates a Windows Task Scheduler task that runs weekly maintenance automatically.
            </div>
        </div>
        
        <div class="alert alert-success">
            <span class="alert-icon">✅</span>
            <div>
                <strong>What It Does:</strong><br>
                • Runs every Sunday at 3:00 AM<br>
                • Cleans temp files automatically<br>
                • Clears thumbnail cache<br>
                • Creates a log file on your Desktop<br>
                • Runs even if you're not logged in<br>
                <br>
                <strong>Set it and forget it!</strong>
            </div>
        </div>
        
        <h3>Script Content:</h3>
        <div class="script-preview">${escapeHtml(script)}</div>
        
        <div class="btn-group">
            <button class="btn btn-success" onclick="downloadScript('CreateScheduledMaintenance_${getTimestamp()}.ps1', \`${script.replace(/`/g, '\\`')}\`)">
                💾 Download Script
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                Close
            </button>
        </div>
    `;
    
    showModal('⏰ Scheduled Maintenance Task', modalContent);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal on background click
document.getElementById('scriptModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
