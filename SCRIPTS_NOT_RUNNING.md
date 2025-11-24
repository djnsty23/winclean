# ⚠️ SCRIPTS CLOSING INSTANTLY? READ THIS!

## 🔍 ALL Reasons Why Scripts Might Fail

### **Reason #1: Execution Policy (99% of cases)**

**Symptom:** Script closes instantly, no log file created, no error message

**Cause:** PowerShell's security blocks downloaded scripts

**FIX - Method 1 (RECOMMENDED):**
1. Right-click the `.ps1` file
2. Click **Properties**
3. At the bottom, check **☑ Unblock**
4. Click **OK**
5. Now right-click → **Run with PowerShell** or **Run as Administrator**

**FIX - Method 2 (One-Time):**
```powershell
# Open PowerShell as Admin, then:
powershell -ExecutionPolicy Bypass -File "C:\Downloads\YourScript.ps1"
```

**How to check if this is your issue:**
```powershell
# Run this in PowerShell:
Get-ExecutionPolicy

# If it says "Restricted", that's your problem!
```

---

### **Reason #2: RESTORE Script Bug (FIXED)**

**Bug:** The generated RESTORE script was calling `Write-Log` function before defining it.

**Status:** ✅ **FIXED** in latest version

**If you have an OLD restore script:**
- Re-download a fresh optimization script from the portal
- The new restore script will have the function defined first

---

### **Reason #3: Script Not Run as Administrator**

**Symptom:** Script runs but shows errors for registry/service changes

**Cause:** Many optimizations need admin rights

**FIX:**
- Right-click script → **Run as Administrator** (not just "Run with PowerShell")

---

### **Reason #4: Antivirus Blocking**

**Symptom:** Script deleted immediately or quarantined

**Cause:** Antivirus sees PowerShell script as suspicious

**FIX:**
1. Add exception in your antivirus for the download folder
2. OR temporarily disable antivirus while running (not recommended)
3. OR review script source code and whitelist it

---

### **Reason #5: Corrupted Download**

**Symptom:** Syntax errors when trying to run

**Cause:** Download interrupted or incomplete

**FIX:**
1. Delete the downloaded file
2. Clear browser cache
3. Re-download from portal
4. Verify file size is > 5KB

---

## ✅ Step-by-Step Diagnostic

Run through this checklist:

```
[ ] 1. Did you UNBLOCK the file? (Right-click → Properties → Unblock)
[ ] 2. Are you running as Administrator?
[ ] 3. Is your execution policy set to allow scripts?
    Run in PowerShell: Get-ExecutionPolicy
    If "Restricted", use Method 1 or 2 above
[ ] 4. Is the file size normal? (Should be ~15-50KB depending on options)
[ ] 5. Did you download the LATEST version from GitHub Pages?
[ ] 6. Did you check antivirus quarantine?
```

---

## 🧪 Test Script

Run this minimal test to verify PowerShell works:

**Save as `test.ps1`:**
```powershell
Write-Host "SUCCESS! PowerShell is working!" -ForegroundColor Green
Write-Host "Press any key to exit..." -ForegroundColor Yellow
pause
```

**Then:**
1. Right-click → Properties → Unblock
2. Right-click → Run with PowerShell

**If this fails:** Your execution policy is the issue  
**If this works:** The problem is with the main script - re-download it

---

## 🔧 Emergency Fallback: BAT File

If PowerShell scripts absolutely won't work, use the BAT file:

1. Download **`SIMPLE_FIX.bat`**
2. Right-click → **Run as Administrator**
3. Works every time (no execution policy)

**Limitation:** BAT file only does temp cleaning, not full optimizations

---

## 📋 What SHOULD Happen (Normal Execution)

When script runs successfully, you'll see:

1. ✅ PowerShell window opens
2. ✅ "Creating log file..." message appears
3. ✅ Color-coded output showing progress
4. ✅ Sections for backup, cleanup, privacy, etc.
5. ✅ Notepad opens automatically with log file
6. ✅ Window stays open with "Press any key to exit..."

**Total runtime:** 30 seconds to 2 minutes depending on options

**Files created on Desktop:**
- `Windows_Optimization_Log_YYYY-MM-DD_HH-MM-SS.txt`
- `Windows_Optimization_Backup_YYYY-MM-DD_HH-MM-SS.json` (if backup enabled)
- `RESTORE_Windows_Settings_YYYY-MM-DD_HH-MM-SS.ps1` (if backup enabled)
- `Startup_Report_YYYY-MM-DD_HH-MM.html` (if startup scan enabled)

---

## 🐛 Still Not Working?

**Collect this information:**

1. **Your execution policy:**
   ```powershell
   Get-ExecutionPolicy -List
   ```

2. **PowerShell version:**
   ```powershell
   $PSVersionTable.PSVersion
   ```

3. **Did you unblock the file?**
   - Yes / No

4. **What happens when you double-click the script?**
   - Closes instantly (no window)
   - Opens and closes fast (see a flash)
   - Opens and shows error
   - Nothing happens

5. **Can you run this command in PowerShell?**
   ```powershell
   Write-Host "Test" -ForegroundColor Green
   ```

6. **Windows version:**
   ```powershell
   Get-ComputerInfo | Select-Object WindowsVersion, OsBuildNumber
   ```

---

## 💡 Pro Tips

### Tip 1: See Errors Before Window Closes
Instead of double-clicking, run the script from PowerShell console:

```powershell
# Open PowerShell as Admin
cd C:\Users\YourName\Downloads
.\Windows_Optimizer_2025-11-24.ps1
```

Now errors will stay visible!

### Tip 2: Force Verbose Output
Add this to the top of your script (edit with Notepad):

```powershell
$ErrorActionPreference = "Continue"
Set-PSDebug -Trace 1
```

### Tip 3: Check if File is Blocked

```powershell
Get-Item ".\script.ps1" -Stream Zone.Identifier
# If this returns data, file is blocked. Unblock it!
```

---

## 🎯 Quick Reference

| Problem | Quick Fix |
|---------|-----------|
| Instant close, no log | Unblock file |
| Permission denied errors | Run as Administrator |
| "cannot be loaded" error | Execution policy OR unblock file |
| Antivirus alert | Add exception |
| Syntax errors | Re-download script |
| Old restore script fails | Download NEW optimization script |

---

## ✅ Checklist for Success

Before running ANY PowerShell script:

1. ✅ Downloaded from trusted source (our GitHub Pages)
2. ✅ File unblocked (Properties → Unblock)
3. ✅ Running as Administrator
4. ✅ Reviewed script contents (it's open source!)
5. ✅ Have recent backup or restore point

---

**Remember:** These security measures exist for a reason! Never disable execution policy globally or skip unblocking untrusted scripts.

**Our scripts are safe** (open source, reviewed, no network access), but always verify before running!

---

Last Updated: 2025-11-24  
**Status:** All known bugs FIXED ✅
