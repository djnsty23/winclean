// Windows 11 Optimization Portal - Enhanced Script Generator
// Version 2.0 - With granular controls, validation, and better UX

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('scriptModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('scriptModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function downloadScript(filename, content) {
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('✅ Script downloaded! Check your Downloads folder.', 'success');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.minWidth = '300px';
    notification.style.animation = 'slideIn 0.3s ease-out';
    notification.innerHTML = `
        <span class="alert-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <div>${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
           now.getHours().toString().padStart(2, '0') + '-' +
           now.getMinutes().toString().padStart(2, '0');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// SELECTION COUNTER FUNCTIONS
// ============================================

function updateCount(category) {
    const containers = {
        'temp': 'temp-options',
        'startup': 'startup-options',
        'privacy': 'privacy-options',
        'perf': 'perf-options',
        'services': 'services-options',
        'disk': 'disk-options'
    };
    
    const container = document.getElementById(containers[category]);
    if (!container) return;
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    const countElement = document.getElementById(`${category}-count`);
    if (countElement) {
        countElement.textContent = checkedCount;
    }
}

function selectAll(category) {
    const containers = {
        'temp': 'temp-options',
        'startup': 'startup-options',
        'privacy': 'privacy-options',
        'perf': 'perf-options',
        'services': 'services-options',
        'disk': 'disk-options'
    };
    
    const container = document.getElementById(containers[category]);
    if (!container) return;
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = true;
    });
    
    updateCount(category);
}

function selectNone(category) {
    const containers = {
        'temp': 'temp-options',
        'startup': 'startup-options',
        'privacy': 'privacy-options',
        'perf': 'perf-options',
        'services': 'services-options',
        'disk': 'disk-options'
    };
    
    const container = document.getElementById(containers[category]);
    if (!container) return;
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = false;
    });
    
    updateCount(category);
}

// Initialize all counters on page load
window.addEventListener('DOMContentLoaded', () => {
    updateCount('temp');
    updateCount('startup');
    updateCount('privacy');
    updateCount('perf');
    updateCount('services');
    updateCount('disk');
});

// ============================================
// VALIDATION FUNCTIONS
// ============================================

function validateSelection(category, minRequired = 0) {
    const containers = {
        'temp': 'temp-options',
        'startup': 'startup-options',
        'privacy': 'privacy-options',
        'perf': 'perf-options',
        'disk': 'disk-options'
    };
    
    const container = document.getElementById(containers[category]);
    if (!container) return true;
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    if (checkedCount < minRequired) {
        showNotification(`⚠️ Please select at least ${minRequired} option(s) for ${category} cleaning.`, 'warning');
        return false;
    }
    
    return true;
}

function showConfirmation(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const body = document.getElementById('confirmBody');
    
    body.innerHTML = `
        <div class="alert alert-warning">
            <span class="alert-icon">⚠️</span>
            <div>${message}</div>
        </div>
        <div class="btn-group">
            <button class="btn btn-primary" onclick="confirmAndExecute()" style="flex: 1;">
                ✓ Yes, Create Script
            </button>
            <button class="btn btn-secondary" onclick="closeConfirmModal()" style="flex: 1;">
                ✕ Cancel
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Store callback
    window.confirmCallback = onConfirm;
}

function confirmAndExecute() {
    closeConfirmModal();
    if (window.confirmCallback) {
        window.confirmCallback();
        window.confirmCallback = null;
    }
}

// ============================================
// TEMP FILE CLEANER GENERATOR
// ============================================

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
    
    // Validation
    if (!options.userTemp && !options.windowsTemp && !options.prefetch && !options.recycle && !options.thumbnail) {
        showNotification('⚠️ Please select at least one cleanup option!', 'warning');
        return;
    }
    
    // Confirmation for destructive actions
    if (options.recycle && !previewOnly) {
        showConfirmation(
            'Confirm Recycle Bin Deletion',
            '<strong>Are you sure?</strong><br>You selected "Empty Recycle Bin". Files will be permanently deleted and cannot be recovered!<br><br>Make sure you don\'t need anything in your Recycle Bin before proceeding.',
            () => createTempCleanerScript(options)
        );
        return;
    }
    
    createTempCleanerScript(options);
}

function createTempCleanerScript(options) {
    const script = `# Windows 11 Temp File Cleaner
# Generated: ${new Date().toLocaleString()}
# Mode: ${options.previewOnly ? 'PREVIEW ONLY - No files will be deleted' : 'CLEANUP MODE'}
# Generated by Windows 11 Optimization Portal

#Requires -RunAsAdministrator

# Set error handling
$ErrorActionPreference = "Continue"

# Check for Administrator privileges
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║           ADMINISTRATOR RIGHTS REQUIRED                ║" -ForegroundColor Red
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Red
    Write-Host ""
    Write-Host "This script requires Administrator privileges to run." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To fix this:" -ForegroundColor Cyan
    Write-Host "  1. Right-click this script file" -ForegroundColor White
    Write-Host "  2. Select 'Run with PowerShell' or 'Run as Administrator'" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       Windows 11 Temp File Cleaner                     ║" -ForegroundColor Cyan
Write-Host "║       ${options.previewOnly ? 'PREVIEW MODE - No Changes Made' : 'CLEANUP MODE - Files Will Be Deleted'}           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Initialize counters
$totalFilesScanned = 0
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
    
    Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host "📂 Scanning: $Description" -ForegroundColor Yellow
    Write-Host "   Path: $Path" -ForegroundColor Gray
    
    if (-not (Test-Path $Path)) {
        Write-Host "   ⚠️  Path not found, skipping." -ForegroundColor Yellow
        return
    }
    
    $filesScanned = 0
    $sizeBefore = 0
    $filesDeleted = 0
    $spaceFreed = 0
    
    try {
        # Get all items recursively
        $items = @(Get-ChildItem -Path $Path -Recurse -Force -ErrorAction SilentlyContinue)
        
        if ($items.Count -eq 0) {
            Write-Host "   ✓ No files found (already clean)" -ForegroundColor Green
            return
        }
        
        foreach ($item in $items) {
            try {
                if (-not $item.PSIsContainer) {
                    $size = $item.Length
                    $filesScanned++
                    $sizeBefore += $size
                    
                    ${options.previewOnly ? `if ($filesScanned -le 10) {
                        Write-Host "   [PREVIEW] Would delete: $($item.Name)" -ForegroundColor Gray
                    }` : `
                    Remove-Item -Path $item.FullName -Force -ErrorAction Stop
                    $filesDeleted++
                    $spaceFreed += $size`}
                }
            }
            catch {
                # File in use or access denied - skip silently
                # This is normal and expected for system files
            }
        }
        
        ${!options.previewOnly ? `
        # Try to remove empty directories
        $directories = @(Get-ChildItem -Path $Path -Recurse -Force -Directory -ErrorAction SilentlyContinue | Sort-Object -Property FullName -Descending)
        foreach ($dir in $directories) {
            try {
                Remove-Item -Path $dir.FullName -Force -ErrorAction Stop
            }
            catch {
                # Directory not empty or in use - skip silently
            }
        }` : ''}
        
        $script:totalFilesScanned += $filesScanned
        $script:totalFilesDeleted += $filesDeleted
        $script:totalSpaceFreed += $spaceFreed
        
        Write-Host "   📊 Files scanned: $filesScanned" -ForegroundColor White
        ${options.previewOnly ? 
        `Write-Host "   💭 Would delete: $filesDeleted files" -ForegroundColor Cyan
        if ($filesScanned -gt 10) {
            Write-Host "   ℹ️  (showing first 10 files only)" -ForegroundColor Gray
        }` :
        `Write-Host "   ✓ Files deleted: $filesDeleted" -ForegroundColor Green`}
        Write-Host "   💾 Space: $([math]::Round($spaceFreed / 1MB, 2)) MB ($([math]::Round($spaceFreed / 1GB, 3)) GB)" -ForegroundColor $(if ($spaceFreed -gt 100MB) { 'Green' } else { 'White' })
        
        $script:logEntries += [PSCustomObject]@{
            Location = $Description
            Path = $Path
            FilesScanned = $filesScanned
            FilesDeleted = $filesDeleted
            SpaceFreedMB = [math]::Round($spaceFreed / 1MB, 2)
        }
    }
    catch {
        Write-Host "   ❌ Error accessing path: $($_.Exception.Message)" -ForegroundColor Red
        $script:errors += "Failed to access: $Path - $($_.Exception.Message)"
    }
}

# Start cleanup
Write-Host "🚀 Starting cleanup process..." -ForegroundColor Cyan
Write-Host ""

${options.userTemp ? `
# Clean User Temp Folder
Remove-TempFiles -Path $env:TEMP -Description "User Temp Folder (%TEMP%)"
` : ''}

${options.windowsTemp ? `
# Clean Windows Temp Folder
Remove-TempFiles -Path "C:\\Windows\\Temp" -Description "Windows System Temp"
` : ''}

${options.prefetch ? `
# Clean Prefetch
Remove-TempFiles -Path "C:\\Windows\\Prefetch" -Description "Prefetch Cache"
` : ''}

${options.thumbnail ? `
# Clear Thumbnail Cache
Remove-TempFiles -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer" -Description "Thumbnail Cache"
` : ''}

${options.recycle && !options.previewOnly ? `
# Empty Recycle Bin
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "🗑️  Emptying Recycle Bin..." -ForegroundColor Yellow
try {
    Clear-RecycleBin -Force -ErrorAction Stop
    Write-Host "   ✓ Recycle Bin emptied successfully" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Failed to empty Recycle Bin: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""
` : ''}

# Summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                  CLEANUP SUMMARY                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total files scanned: $totalFilesScanned" -ForegroundColor White
Write-Host "Total files ${options.previewOnly ? 'that would be deleted' : 'deleted'}: $totalFilesDeleted" -ForegroundColor $(if ($options.previewOnly) { 'Cyan' } else { 'Green' })
Write-Host "Total space ${options.previewOnly ? 'that would be freed' : 'freed'}: $([math]::Round($totalSpaceFreed / 1MB, 2)) MB ($([math]::Round($totalSpaceFreed / 1GB, 3)) GB)" -ForegroundColor $(if ($options.previewOnly) { 'Cyan' } else { 'Green' })

if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Errors encountered: $($errors.Count)" -ForegroundColor Yellow
    Write-Host "   (Most errors are normal - files in use by Windows)" -ForegroundColor Gray
}

${options.log && !options.previewOnly ? `
# Save log to Desktop
Write-Host ""
Write-Host "📝 Saving cleanup log..." -ForegroundColor Yellow
$logPath = "$env:USERPROFILE\\Desktop\\TempCleanup_${getTimestamp()}.txt"
$logContent = @"
════════════════════════════════════════════════════════
    Windows 11 Temp File Cleaner - Detailed Log
════════════════════════════════════════════════════════

Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Computer: $env:COMPUTERNAME
User: $env:USERNAME

════════════════════════════════════════════════════════
                    SUMMARY
════════════════════════════════════════════════════════

Total Files Scanned: $totalFilesScanned
Total Files Deleted: $totalFilesDeleted
Total Space Freed: $([math]::Round($totalSpaceFreed / 1MB, 2)) MB ($([math]::Round($totalSpaceFreed / 1GB, 3)) GB)

════════════════════════════════════════════════════════
                DETAILED BREAKDOWN
════════════════════════════════════════════════════════

"@

foreach ($entry in $logEntries) {
    $logContent += @"

Location: $($entry.Location)
Path: $($entry.Path)
Files Scanned: $($entry.FilesScanned)
Files Deleted: $($entry.FilesDeleted)
Space Freed: $($entry.SpaceFreedMB) MB

"@
}

if ($errors.Count -gt 0) {
    $logContent += @"

════════════════════════════════════════════════════════
                     ERRORS
════════════════════════════════════════════════════════

"@
    foreach ($error in $errors) {
        $logContent += "$error`n"
    }
}

$logContent | Out-File -FilePath $logPath -Encoding UTF8
Write-Host "   ✓ Log saved to: $logPath" -ForegroundColor Green
` : ''}

Write-Host ""
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
${options.previewOnly ? 
`Write-Host "ℹ️  Preview complete! No files were deleted." -ForegroundColor Cyan
Write-Host "   To actually clean files, run this script in cleanup mode." -ForegroundColor Gray` :
`Write-Host "✓ Cleanup completed successfully!" -ForegroundColor Green
Write-Host "  Your system should now have more free space." -ForegroundColor Gray`}
Write-Host ""
Read-Host "Press Enter to exit"
`;

    // Show modal with script preview
    const modalContent = `
        <div class="alert ${options.previewOnly ? 'alert-info' : 'alert-warning'}">
            <span class="alert-icon">${options.previewOnly ? 'ℹ️' : '⚠️'}</span>
            <div>
                <strong>${options.previewOnly ? 'Preview Mode' : 'Cleanup Mode'}</strong><br>
                ${options.previewOnly ? 
                    'This script will scan and show what would be deleted <strong>without actually removing files</strong>. Safe to run anytime!' :
                    'This script will <strong>permanently delete temporary files</strong>. Files in use will be automatically skipped.'}
            </div>
        </div>
        
        <div class="alert alert-success">
            <span class="alert-icon">✅</span>
            <div>
                <strong>Selected Options:</strong><br>
                ${options.userTemp ? '✓ User Temp Folder (%TEMP%)<br>' : ''}
                ${options.windowsTemp ? '✓ Windows Temp Folder<br>' : ''}
                ${options.prefetch ? '✓ Prefetch Cache<br>' : ''}
                ${options.recycle ? '✓ Empty Recycle Bin<br>' : ''}
                ${options.thumbnail ? '✓ Thumbnail Cache<br>' : ''}
                ${options.log ? '✓ Create Cleanup Log<br>' : ''}
            </div>
        </div>
        
        <div class="alert alert-info">
            <span class="alert-icon">📋</span>
            <div>
                <strong>How to Run This Script:</strong><br>
                1. Click "Download Script" below<br>
                2. Find the downloaded .ps1 file (usually in Downloads folder)<br>
                3. Right-click the file → "Run with PowerShell"<br>
                4. If you see a security warning, click "Run anyway" or "Yes"<br>
                5. Wait for the script to complete (may take 1-5 minutes)
            </div>
        </div>
        
        <h3>Script Preview:</h3>
        <div class="script-preview">${escapeHtml(script)}</div>
        
        <div class="btn-group">
            <button class="btn btn-success" onclick="downloadScript('TempCleaner_${options.previewOnly ? 'Preview' : 'Cleanup'}_${getTimestamp()}.ps1', \`${script.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">
                💾 Download Script
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                Close Preview
            </button>
        </div>
    `;
    
    showModal(`${options.previewOnly ? '👀 Preview Mode' : '🗑️ Temp Cleaner'} Script Ready`, modalContent);
}

// ============================================
// STARTUP OPTIMIZER GENERATOR
// ============================================

function generateStartupScript() {
    const options = {
        scan: document.getElementById('startup-scan').checked,
        report: document.getElementById('startup-report').checked,
        services: document.getElementById('startup-services').checked
    };
    
    if (!options.scan && !options.report && !options.services) {
        showNotification('⚠️ Please select at least one analysis option!', 'warning');
        return;
    }
    
    const script = `# Windows 11 Startup Optimizer & Analyzer
# Generated: ${new Date().toLocaleString()}
# Generated by Windows 11 Optimization Portal

#Requires -RunAsAdministrator

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        Startup Optimizer & Analyzer                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

${options.scan ? `
# Get all startup programs
Write-Host "🔍 Scanning startup programs..." -ForegroundColor Yellow
$startupItems = @()

# Registry-based startup items
$registryPaths = @(
    @{Path="HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"; Scope="Machine (All Users)"},
    @{Path="HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce"; Scope="Machine (Run Once)"},
    @{Path="HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"; Scope="Current User"},
    @{Path="HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce"; Scope="Current User (Run Once)"}
)

foreach ($regPath in $registryPaths) {
    if (Test-Path $regPath.Path) {
        try {
            $items = Get-ItemProperty -Path $regPath.Path -ErrorAction Stop
            $items.PSObject.Properties | Where-Object { $_.Name -notmatch '^PS' } | ForEach-Object {
                $startupItems += [PSCustomObject]@{
                    Name = $_.Name
                    Location = $regPath.Path
                    Scope = $regPath.Scope
                    Command = $_.Value
                    Type = "Registry"
                }
            }
        }
        catch {
            # Ignore access errors
        }
    }
}

# Startup folder items
$startupFolders = @(
    @{Path="$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs\\Startup"; Scope="Current User"},
    @{Path="$env:ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Startup"; Scope="All Users"}
)

foreach ($folderInfo in $startupFolders) {
    if (Test-Path $folderInfo.Path) {
        Get-ChildItem -Path $folderInfo.Path -ErrorAction SilentlyContinue | ForEach-Object {
            $startupItems += [PSCustomObject]@{
                Name = $_.Name
                Location = $folderInfo.Path
                Scope = $folderInfo.Scope
                Command = $_.FullName
                Type = "Shortcut"
            }
        }
    }
}

Write-Host "   ✓ Found $($startupItems.Count) startup items" -ForegroundColor Green
Write-Host ""

# Display startup items
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "            STARTUP PROGRAMS FOUND" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

foreach ($item in $startupItems) {
    Write-Host "──────────────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host "📌 $($item.Name)" -ForegroundColor White
    Write-Host "   Type: $($item.Type)" -ForegroundColor Gray
    Write-Host "   Scope: $($item.Scope)" -ForegroundColor Gray
    Write-Host "   Location: $($item.Location)" -ForegroundColor Gray
    Write-Host "   Command: $($item.Command)" -ForegroundColor Gray
}
Write-Host ""
` : ''}

${options.services ? `
# Analyze Services
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "            WINDOWS SERVICES ANALYSIS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Services that can potentially be optimized
$servicesToAnalyze = @(
    "DiagTrack",
    "dmwappushservice",
    "SysMain",
    "WSearch",
    "MapsBroker"
)

foreach ($serviceName in $servicesToAnalyze) {
    try {
        $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
        if ($service) {
            Write-Host "──────────────────────────────────────────────────────" -ForegroundColor Gray
            Write-Host "🔧 Service: $serviceName" -ForegroundColor White
            Write-Host "   Display Name: $($service.DisplayName)" -ForegroundColor Gray
            Write-Host "   Status: $($service.Status)" -ForegroundColor $(if ($service.Status -eq 'Running') { 'Green' } else { 'Yellow' })
            Write-Host "   Startup Type: $($service.StartType)" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "   ⚠️  Could not query service: $serviceName" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "ℹ️  NOTE: This is ANALYSIS ONLY. No services were changed." -ForegroundColor Yellow
Write-Host "   To optimize services, use the Performance Tuning section" -ForegroundColor Gray
Write-Host "   in the portal with granular service selection." -ForegroundColor Gray
Write-Host ""
` : ''}

${options.report ? `
# Generate HTML Report
Write-Host "📝 Generating HTML report..." -ForegroundColor Yellow
$reportPath = "$env:USERPROFILE\\Desktop\\StartupReport_${getTimestamp()}.html"

$htmlReport = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Windows 11 Startup Analysis Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: #0078d4;
            border-bottom: 3px solid #0078d4;
            padding-bottom: 10px;
        }
        h2 {
            color: #2c3e50;
            margin-top: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th {
            background: #0078d4;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
        }
        tr:hover {
            background: #f9f9f9;
        }
        .safe {
            color: #107c10;
            font-weight: 600;
        }
        .warning {
            color: #f7630c;
            font-weight: 600;
        }
        .info {
            background: #e6f3ff;
            padding: 15px;
            border-left: 4px solid #0078d4;
            margin: 15px 0;
            border-radius: 4px;
        }
        .recommendation {
            background: #fff4e6;
            padding: 15px;
            border-left: 4px solid #f7630c;
            margin: 10px 0;
            border-radius: 4px;
        }
        .stat-box {
            display: inline-block;
            background: #0078d4;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 10px;
            min-width: 150px;
            text-align: center;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
        }
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Windows 11 Startup Analysis Report</h1>
        <p><strong>Generated:</strong> $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")</p>
        <p><strong>Computer:</strong> $env:COMPUTERNAME</p>
        <p><strong>User:</strong> $env:USERNAME</p>
        
        <div class="stat-box">
            <div class="stat-value">$($startupItems.Count)</div>
            <div class="stat-label">Startup Items</div>
        </div>
        
        <h2>📋 Startup Programs</h2>
        <table>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Scope</th>
                <th>Location</th>
                <th>Recommendation</th>
            </tr>
"@

$commonSafeToDisable = @('OneDrive', 'Spotify', 'Discord', 'Steam', 'Epic', 'Adobe', 'Update', 'Creative Cloud')
$keepEnabled = @('Security', 'Defender', 'Antivirus', 'Driver', 'Audio', 'Graphics', 'Intel', 'AMD', 'NVIDIA')

foreach ($item in $startupItems) {
    $isSafeToDisable = $false
    $recommendation = "Review - Check if you need this"
    
    foreach ($pattern in $commonSafeToDisable) {
        if ($item.Name -match $pattern) {
            $isSafeToDisable = $true
            $recommendation = "Safe to disable if you don't use daily"
            break
        }
    }
    
    foreach ($pattern in $keepEnabled) {
        if ($item.Name -match $pattern) {
            $isSafeToDisable = $false
            $recommendation = "Keep enabled - important for system"
            break
        }
    }
    
    $class = if ($isSafeToDisable) { "warning" } else { "safe" }
    
    $htmlReport += @"
            <tr>
                <td><strong>$($item.Name)</strong></td>
                <td>$($item.Type)</td>
                <td>$($item.Scope)</td>
                <td style="font-size: 0.85em; color: #666;">$($item.Location)</td>
                <td class="$class">$recommendation</td>
            </tr>
"@
}

$htmlReport += @"
        </table>
        
        <div class="recommendation">
            <h3>💡 Recommendations:</h3>
            <ul>
                <li><strong>Safe to disable:</strong> Cloud sync apps (OneDrive, Dropbox), chat apps (Discord, Skype), game launchers (Steam, Epic), update checkers</li>
                <li><strong>Keep enabled:</strong> Security software (antivirus), hardware drivers (audio, graphics, touchpad), system utilities</li>
                <li><strong>Not sure?</strong> Search online for "[Program Name] startup" to see if others recommend disabling it</li>
            </ul>
        </div>
        
        <div class="info">
            <h3>📖 How to Disable Startup Items:</h3>
            <ol>
                <li>Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Esc</kbd> to open Task Manager</li>
                <li>Go to the <strong>Startup</strong> tab</li>
                <li>Right-click any item you want to disable</li>
                <li>Select <strong>Disable</strong></li>
                <li>Restart your computer to see the improvements</li>
            </ol>
            <p><strong>Note:</strong> Disabling startup items doesn't uninstall programs - they just won't start automatically. You can still open them manually when needed.</p>
        </div>
        
        <div class="info">
            <h3>✨ Expected Results:</h3>
            <ul>
                <li><strong>Faster boot time:</strong> Can save 30-60 seconds on startup</li>
                <li><strong>Less RAM usage:</strong> More memory available for programs you're actually using</li>
                <li><strong>Quieter startup:</strong> Less disk and CPU activity when logging in</li>
            </ul>
        </div>
    </div>
</body>
</html>
"@

$htmlReport | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "   ✓ Report saved to: $reportPath" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Opening report in your browser..." -ForegroundColor Yellow
Start-Process $reportPath
` : ''}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              ANALYSIS COMPLETE                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
${options.report ? `Write-Host "✓ HTML report created and opened in browser" -ForegroundColor Green` : ''}
Write-Host "ℹ️  This script did not make any changes to your system." -ForegroundColor Cyan
Write-Host "   Use Task Manager to manually disable startup items." -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"
`;

    const modalContent = `
        <div class="alert alert-info">
            <span class="alert-icon">ℹ️</span>
            <div>
                <strong>Startup Analyzer - Analysis Only</strong><br>
                This script will scan your startup programs and ${options.report ? 'create a detailed HTML report' : 'show them in the console'}. 
                <strong>No changes will be made to your system.</strong> You'll manually disable items using Task Manager after reviewing the analysis.
            </div>
        </div>
        
        <div class="alert alert-success">
            <span class="alert-icon">✅</span>
            <div>
                <strong>Selected Options:</strong><br>
                ${options.scan ? '✓ Scan all startup items<br>' : ''}
                ${options.report ? '✓ Generate HTML report<br>' : ''}
                ${options.services ? '✓ Analyze Windows services<br>' : ''}
            </div>
        </div>
        
        <h3>Script Preview:</h3>
        <div class="script-preview">${escapeHtml(script)}</div>
        
        <div class="btn-group">
            <button class="btn btn-success" onclick="downloadScript('StartupAnalyzer_${getTimestamp()}.ps1', \`${script.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">
                💾 Download Script
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                Close Preview
            </button>
        </div>
    `;
    
    showModal('⚡ Startup Analyzer Script Ready', modalContent);
}

// ============================================
// PRIVACY OPTIMIZER GENERATOR
// ============================================

function generatePrivacyScript(preview = false, restore = false) {
    const options = {
        telemetry: document.getElementById('privacy-telemetry').checked,
        cortana: document.getElementById('privacy-cortana').checked,
        ads: document.getElementById('privacy-ads').checked,
        location: document.getElementById('privacy-location').checked,
        feedback: document.getElementById('privacy-feedback').checked
    };
    
    if (!options.telemetry && !options.cortana && !options.ads && !options.location && !options.feedback) {
        showNotification('⚠️ Please select at least one privacy option!', 'warning');
        return;
    }
    
    const script = `# Windows 11 Privacy & Telemetry Optimizer
# Generated: ${new Date().toLocaleString()}
# Mode: ${restore ? 'RESTORE DEFAULT SETTINGS' : 'OPTIMIZE PRIVACY'}
# Generated by Windows 11 Optimization Portal

#Requires -RunAsAdministrator

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    Privacy & Telemetry ${restore ? 'Restore' : 'Optimizer'}                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Create restore point
Write-Host "📌 Creating system restore point..." -ForegroundColor Yellow
try {
    Enable-ComputerRestore -Drive "C:\\" -ErrorAction SilentlyContinue
    Checkpoint-Computer -Description "Before Privacy Changes - $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -RestorePointType "MODIFY_SETTINGS" -ErrorAction Stop
    Write-Host "   ✓ Restore point created successfully" -ForegroundColor Green
}
catch {
    Write-Host "   ⚠️  Warning: Could not create restore point" -ForegroundColor Yellow
    Write-Host "   Continuing anyway (changes are still reversible via registry)" -ForegroundColor Gray
}
Write-Host ""

$changesApplied = 0
$changesFailed = 0

${options.telemetry ? `
# ${restore ? 'Restore' : 'Minimize'} Telemetry
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "📡 ${restore ? 'Restoring' : 'Minimizing'} telemetry..." -ForegroundColor Yellow
try {
    if (-not (Test-Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection")) {
        New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -Type DWord -Value ${restore ? '3' : '0'} -ErrorAction Stop
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection" -Name "AllowTelemetry" -Type DWord -Value ${restore ? '3' : '0'} -ErrorAction Stop
    Write-Host "   ✓ Telemetry ${restore ? 'restored to default (Full)' : 'set to minimum (Security only)'}" -ForegroundColor Green
    $script:changesApplied++
}
catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $script:changesFailed++
}
` : ''}

${options.cortana ? `
# ${restore ? 'Enable' : 'Disable'} Cortana
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "🎙️  ${restore ? 'Enabling' : 'Disabling'} Cortana..." -ForegroundColor Yellow
try {
    if (-not (Test-Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search")) {
        New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" -Name "AllowCortana" -Type DWord -Value ${restore ? '1' : '0'} -ErrorAction Stop
    Write-Host "   ✓ Cortana ${restore ? 'enabled' : 'disabled'}" -ForegroundColor Green
    Write-Host "   ℹ️  Windows Search will still work normally" -ForegroundColor Gray
    $script:changesApplied++
}
catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $script:changesFailed++
}
` : ''}

${options.ads ? `
# ${restore ? 'Enable' : 'Disable'} Advertising ID
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "📢 ${restore ? 'Enabling' : 'Disabling'} Advertising ID..." -ForegroundColor Yellow
try {
    if (-not (Test-Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo")) {
        New-Item -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" -Name "Enabled" -Type DWord -Value ${restore ? '1' : '0'} -ErrorAction Stop
    Write-Host "   ✓ Advertising ID ${restore ? 'enabled' : 'disabled'}" -ForegroundColor Green
    $script:changesApplied++
}
catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $script:changesFailed++
}
` : ''}

${options.location ? `
# ${restore ? 'Enable' : 'Disable'} Location Tracking
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "📍 ${restore ? 'Enabling' : 'Disabling'} location tracking..." -ForegroundColor Yellow
try {
    if (-not (Test-Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location")) {
        New-Item -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location" -Name "Value" -Type String -Value ${restore ? '"Allow"' : '"Deny"'} -ErrorAction Stop
    Write-Host "   ✓ Location tracking ${restore ? 'enabled' : 'disabled'}" -ForegroundColor Green
    ${!restore ? `Write-Host "   ℹ️  Maps and Weather apps won't have access to location" -ForegroundColor Gray` : ''}
    $script:changesApplied++
}
catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $script:changesFailed++
}
` : ''}

${options.feedback ? `
# ${restore ? 'Enable' : 'Disable'} Feedback Requests
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "💬 ${restore ? 'Enabling' : 'Disabling'} feedback requests..." -ForegroundColor Yellow
try {
    if (-not (Test-Path "HKCU:\\SOFTWARE\\Microsoft\\Siuf\\Rules")) {
        New-Item -Path "HKCU:\\SOFTWARE\\Microsoft\\Siuf\\Rules" -Force | Out-Null
    }
    if (-not (Test-Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection")) {
        New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Force | Out-Null
    }
    Set-ItemProperty -Path "HKCU:\\SOFTWARE\\Microsoft\\Siuf\\Rules" -Name "NumberOfSIUFInPeriod" -Type DWord -Value 0 -ErrorAction Stop
    Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "DoNotShowFeedbackNotifications" -Type DWord -Value ${restore ? '0' : '1'} -ErrorAction Stop
    Write-Host "   ✓ Feedback requests ${restore ? 'enabled' : 'disabled'}" -ForegroundColor Green
    $script:changesApplied++
}
catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $script:changesFailed++
}
` : ''}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    SUMMARY                              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Changes applied successfully: $changesApplied" -ForegroundColor Green
if ($changesFailed -gt 0) {
    Write-Host "❌ Changes that failed: $changesFailed" -ForegroundColor Red
}
Write-Host ""
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "⚠️  A restart is REQUIRED for all changes to take effect." -ForegroundColor Yellow
Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

$restart = Read-Host "Restart now? (y/n)"
if ($restart -eq 'y' -or $restart -eq 'Y') {
    Write-Host "🔄 Restarting in 10 seconds... (Press Ctrl+C to cancel)" -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    Restart-Computer -Force
} else {
    Write-Host "ℹ️  Remember to restart your computer later for changes to apply." -ForegroundColor Cyan
}
`;

    const modalContent = `
        <div class="alert ${restore ? 'alert-info' : 'alert-warning'}">
            <span class="alert-icon">${restore ? 'ℹ️' : '⚠️'}</span>
            <div>
                <strong>${restore ? 'Restore Mode' : 'Privacy Optimization'}</strong><br>
                ${restore ? 
                    'This script will <strong>restore all Windows privacy settings to their defaults</strong>.' :
                    'This script will <strong>modify Windows registry</strong> to enhance privacy. A system restore point will be created automatically before any changes.'}
            </div>
        </div>
        
        <div class="alert alert-success">
            <span class="alert-icon">✅</span>
            <div>
                <strong>Selected Changes:</strong><br>
                ${options.telemetry ? `✓ ${restore ? 'Restore' : 'Minimize'} Telemetry<br>` : ''}
                ${options.cortana ? `✓ ${restore ? 'Enable' : 'Disable'} Cortana<br>` : ''}
                ${options.ads ? `✓ ${restore ? 'Enable' : 'Disable'} Advertising ID<br>` : ''}
                ${options.location ? `✓ ${restore ? 'Enable' : 'Disable'} Location Tracking<br>` : ''}
                ${options.feedback ? `✓ ${restore ? 'Enable' : 'Disable'} Feedback Requests<br>` : ''}
            </div>
        </div>
        
        <div class="alert alert-info">
            <span class="alert-icon">🔒</span>
            <div>
                <strong>Safety:</strong><br>
                • System restore point created automatically<br>
                • All changes are reversible using the restore script<br>
                • Registry changes are documented and safe<br>
                • Restart required for changes to take effect
            </div>
        </div>
        
        <h3>Script Preview:</h3>
        <div class="script-preview">${escapeHtml(script)}</div>
        
        <div class="btn-group">
            <button class="btn btn-success" onclick="downloadScript('Privacy${restore ? 'Restore' : 'Optimize'}_${getTimestamp()}.ps1', \`${script.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">
                💾 Download Script
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                Close Preview
            </button>
        </div>
    `;
    
    showModal(`🔒 Privacy ${restore ? 'Restore' : 'Optimizer'} Script Ready`, modalContent);
}

// Close modal on background click
document.getElementById('scriptModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.getElementById('confirmModal').addEventListener('click', function(e) {
    if (e.target === this) closeConfirmModal();
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeConfirmModal();
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Show welcome message on load
window.addEventListener('load', () => {
    setTimeout(() => {
        showNotification('👋 Welcome! Select options and click the blue buttons to create scripts.', 'info');
    }, 500);
});

// ============================================
// PERFORMANCE TUNING GENERATOR (Continued in next message due to size)
// Note: This needs to be added - the file is complete up to Privacy Optimizer
// ============================================

