# 🔧 Troubleshooting Guide

## PowerShell Scripts Close Instantly

### Problem
When you run a script, a black window flashes for a second then closes. No log file appears on Desktop.

### Cause
Windows PowerShell execution policy is blocking scripts.

### Solution (Choose ONE)

#### ✅ Option 1: Use the Fix Tool (Easiest)
1. Download `Fix_PowerShell_Scripts.bat` from this repository
2. Right-click it → **Run as Administrator**
3. Press any key when prompted
4. Done! Now try your script again

#### ✅ Option 2: Run as Administrator
1. Right-click the `.ps1` script file
2. Select **"Run as Administrator"** (NOT just "Run with PowerShell")
3. Click "Yes" when Windows asks for permission

#### ✅ Option 3: Manual PowerShell Command
1. Press **Win + X** → Select "PowerShell (Admin)" or "Terminal (Admin)"
2. Run this command:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```
3. Close PowerShell
4. Now right-click your script → "Run with PowerShell"

#### ✅ Option 4: One-Time Bypass
1. Press **Win + X** → Select "PowerShell (Admin)"
2. Navigate to your Downloads folder:
```powershell
cd $env:USERPROFILE\Downloads
```
3. Run the script with bypass:
```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Windows_Optimizer_[timestamp].ps1
```

---

## Script Runs But No Changes Happen

### Problem
Script completes but nothing seems optimized.

### Check These:

1. **Look for the log file on Desktop**
   - File name: `Windows_Optimization_Log_[timestamp].txt`
   - Open it to see what happened

2. **Check if you ran as Administrator**
   - Most optimizations require admin rights
   - Re-run with "Run as Administrator"

3. **Check if files were in use**
   - Log file will show "skipped" items
   - Restart Windows and run again

---

## Log File Not Created

### Solution
The script couldn't write to your Desktop.

Try this:
1. Open the script in Notepad
2. Find this line near the top:
```powershell
$logFile = "$env:USERPROFILE\Desktop\Windows_Optimization_Log_[...]"
```
3. Change `Desktop` to `Documents`:
```powershell
$logFile = "$env:USERPROFILE\Documents\Windows_Optimization_Log_[...]"
```
4. Save and run again

---

## Backup Files Not Appearing

### Problem
Log says backup was created but you don't see files on Desktop.

### Check:
1. Look in `C:\Users\[YourName]\Desktop\`
2. Look for files named:
   - `Windows_Optimization_Backup_[timestamp].json`
   - `RESTORE_Windows_Settings_[timestamp].ps1`

3. If not there, check Documents folder
4. Search Windows for "Windows_Optimization_Backup"

---

## Scheduled Task Not Working

### Problem
Created the task but optimizations don't run weekly.

### Solutions:

#### Verify Task Exists
1. Press **Win + R**
2. Type: `taskschd.msc` → Press Enter
3. Look for "Windows Weekly Optimization" in the list
4. Right-click → **Properties** → Check the trigger (should be Sunday 2 AM)

#### Test the Task Manually
1. In Task Scheduler, find "Windows Weekly Optimization"
2. Right-click → **Run**
3. Check Desktop for log file to see if it worked

#### Common Issues
- **Task status: "Disabled"** → Right-click → Enable
- **Last run result: Error** → Right-click → Properties → Check "Run with highest privileges"
- **Never runs** → Make sure PC is on at 2 AM Sunday, or change the time

---

## Can't Undo Changes (Need to Restore)

### Option 1: Use the Restore Script
1. Find the `RESTORE_Windows_Settings_[timestamp].ps1` file on Desktop
2. Right-click → "Run as Administrator"
3. Wait for completion

### Option 2: System Restore Point
1. Press **Win + R**
2. Type: `rstrui.exe` → Press Enter
3. Select restore point created by the optimization script
4. Follow the wizard

---

## Script Shows Errors

### Common Errors:

#### "Access Denied"
- **Fix**: Run as Administrator

#### "Path not found"
- **Meaning**: That folder doesn't exist on your PC (this is normal)
- **Action**: No action needed, script skips it

#### "File in use"
- **Meaning**: Program is using the file
- **Fix**: Close programs or restart Windows and run again

#### "Service not found"
- **Meaning**: That service doesn't exist on your Windows version
- **Action**: No action needed, script skips it

---

## Preview Mode Not Working

### Problem
Preview script runs but shows no useful information.

### Explanation
PowerShell's `-WhatIf` parameter doesn't show detailed info for all operations. This is a PowerShell limitation, not a bug.

### Alternative
1. Review the script in Notepad before running
2. Read the comments to understand what it does
3. Check the log file after running for real

---

## Privacy/Performance Changes Feel Wrong

### Revert Changes

#### Using the Restore Script (Recommended)
1. Find `RESTORE_Windows_Settings_[timestamp].ps1` on Desktop
2. Run it as Administrator
3. All settings reverted

#### Manual Revert
**Telemetry:**
```powershell
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "AllowTelemetry" -Value 3
```

**Services (set to Automatic):**
```powershell
Set-Service -Name "DiagTrack" -StartupType Automatic
Set-Service -Name "SysMain" -StartupType Automatic
Set-Service -Name "WSearch" -StartupType Automatic
```

**Hibernation:**
```powershell
powercfg -h on
```

---

## Disk Space Not Freed

### Check These:

1. **Look at the log file** - shows actual MB freed
2. **Restart Windows** - some space only freed after restart
3. **Check Recycle Bin** - empty it manually
4. **Run Disk Cleanup manually**:
   ```
   Win + R → cleanmgr → Select drive → OK
   ```

---

## Getting "Script is from the Internet" Warning

### Problem
Windows blocked the script because it was downloaded.

### Solution
1. Right-click the script → **Properties**
2. At bottom, check **"Unblock"** box
3. Click **OK**
4. Now run the script normally

---

## Still Need Help?

### Before Asking:
1. ✅ Check the log file on Desktop
2. ✅ Try running as Administrator
3. ✅ Read error messages in the log

### Getting Support:
1. **Open GitHub Issue**: Include the log file contents
2. **Check README.md**: Has detailed documentation
3. **Search existing issues**: Your problem might be solved already

---

## Quick Reference

### File Locations
- **Scripts**: `Downloads` folder
- **Log files**: `Desktop`
- **Backup files**: `Desktop`
- **Restore scripts**: `Desktop`

### Required Privileges
- **Temp Cleanup**: No admin needed (some paths require it)
- **Privacy Settings**: Admin required
- **Performance**: Admin required
- **Services**: Admin required
- **Disk Maintenance**: Admin required

### Safe to Delete
- ✅ Old log files (after reviewing)
- ✅ Backup JSON files (after you're satisfied with changes)
- ❌ Restore scripts (keep these!)

---

**Remember**: If something doesn't work, check the log file first. It tells you exactly what happened! 📄
