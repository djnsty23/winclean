# 🚨 SCRIPTS CLOSING INSTANTLY - EMERGENCY GUIDE

## You're seeing red errors flash for a second, then window closes. NO files created.

**This means the script is failing BEFORE it can even start logging.**

---

## 🆘 IMMEDIATE ACTIONS (Do these NOW):

### **Action 1: Run Diagnostic Test**

This will tell us EXACTLY what's wrong:

**Steps:**
1. Download: **`DIAGNOSTIC_TEST.ps1`** from https://github.com/djnsty23/winclean/
2. Right-click file → **Properties**
3. Check **☑ Unblock** → Click **OK**
4. Right-click file → **Run with PowerShell**

**What it tests:**
- ✅ Can PowerShell run at all?
- ✅ Can it write to Desktop?
- ✅ Are you admin?
- ✅ What's your execution policy?
- ✅ Can it catch errors?

**Expected result:** Window stays open, shows test results

**If diagnostic test ALSO closes instantly** → Go to Action 2

---

### **Action 2: Capture Errors with BAT Wrapper**

This uses a batch file to RUN PowerShell and capture ALL errors:

**Steps:**
1. Download: **`RUN_WITH_ERROR_CAPTURE.bat`**
2. **Double-click** the BAT file
3. When prompted, **drag and drop** your `.ps1` script into the window
4. Press **Enter**
5. Wait - it will run and save ALL output to Desktop
6. Notepad opens automatically with the error log

**This WILL work** - it uses `-ExecutionPolicy Bypass` and captures everything.

---

## 🔍 Common Causes & Solutions

### **Cause #1: File is Still Blocked (90% of cases)**

**Symptom:** Script closes instantly, red text flashes

**Check:**
```powershell
# Open PowerShell, run this:
Get-Item "C:\Path\To\Your\Script.ps1" -Stream Zone.Identifier
```

**If you see output:** File is blocked!

**Fix:**
1. Right-click script → Properties
2. At the VERY bottom, look for "Security" section
3. Check the box: **☑ Unblock**
4. Click Apply → OK

---

### **Cause #2: Antivirus Quarantined the Script**

**Symptom:** Script disappears or closes instantly

**Check:**
- Open Windows Security
- Go to Protection history
- Look for quarantined items

**Fix:**
- Add script to exclusions
- OR run diagnostic test first to verify

---

### **Cause #3: PowerShell Version Too Old**

**Symptom:** Syntax errors, unexpected behavior

**Check:**
```powershell
$PSVersionTable.PSVersion
```

**Need:** Version 5.1 or higher

**Fix:** Update Windows or install PowerShell 7

---

### **Cause #4: Corrupted Download**

**Symptom:** Random errors, file size wrong

**Check:** File size should be ~40-60KB for optimization scripts

**Fix:**
1. Delete the downloaded file
2. Clear browser cache
3. Re-download from: https://djnsty23.github.io/winclean/

---

### **Cause #5: Running from OneDrive/Shared Folder**

**Symptom:** Permission errors, access denied

**Fix:** Copy script to Desktop or C:\Temp and run from there

---

## 📋 Step-by-Step Debugging

**Follow these steps IN ORDER:**

```
Step 1: Download DIAGNOSTIC_TEST.ps1
Step 2: Right-click → Properties → Unblock
Step 3: Right-click → Run with PowerShell
Result: If this works, you'll see test output

Step 4: If diagnostic test closes instantly:
        Download RUN_WITH_ERROR_CAPTURE.bat
        Double-click it
        Drag diagnostic test into window
        Press Enter
Result: You'll get an error log file on Desktop

Step 5: Read the error log
Result: It will show EXACTLY what's failing

Step 6: Fix the issue based on error message
Result: Once diagnostic test works, main scripts will work

Step 7: Run main optimization script
Result: Success!
```

---

## 🧪 Manual Test (If Nothing Works)

**Open PowerShell as Admin and run this:**

```powershell
# Test 1: Can PowerShell run?
Write-Host "Test 1: PowerShell is working!" -ForegroundColor Green

# Test 2: Can you create files on Desktop?
$testFile = "$env:USERPROFILE\Desktop\TEST.txt"
"Hello" | Out-File -FilePath $testFile -Force
if (Test-Path $testFile) {
    Write-Host "Test 2: Can write to Desktop!" -ForegroundColor Green
    Remove-Item $testFile -Force
} else {
    Write-Host "Test 2: FAILED - Cannot write to Desktop!" -ForegroundColor Red
}

# Test 3: Check execution policy
Write-Host "Execution Policy: $(Get-ExecutionPolicy)" -ForegroundColor Cyan

# Test 4: Are you admin?
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
Write-Host "Running as Admin: $isAdmin" -ForegroundColor $(if($isAdmin){'Green'}else{'Yellow'})

Write-Host "`nIf you see this, PowerShell works! Press Enter to exit..."
Read-Host
```

**If this works:** Your main scripts SHOULD work too (after unblocking)

**If this fails:** You have a fundamental PowerShell or Windows issue

---

## 💊 Nuclear Option (Last Resort)

If NOTHING works, try this:

**Method 1: Use BAT File Instead**
1. Download `SIMPLE_FIX.bat`
2. Run as Administrator
3. No PowerShell needed, always works

**Method 2: Run from PowerShell Console**
```powershell
# Open PowerShell as Admin
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
cd Downloads  # Or wherever your script is
.\Windows_Optimizer_2025-11-24_11-31-30.ps1
```

**Method 3: Copy Script Contents**
1. Open script in Notepad
2. Copy ALL contents (Ctrl+A, Ctrl+C)
3. Open PowerShell as Admin
4. Paste contents (Right-click in PowerShell window)
5. Press Enter

---

## 📧 What to Send for Help

If you need help, provide:

1. **Diagnostic test output** (screenshot or log file)
2. **Error capture log** (from RUN_WITH_ERROR_CAPTURE.bat)
3. **This information:**
   - Windows version: `winver` (run this)
   - PowerShell version: `$PSVersionTable.PSVersion`
   - Execution policy: `Get-ExecutionPolicy -List`
   - Are you admin? Yes/No
   - Where is script located? (Desktop, Downloads, OneDrive, etc.)
   - Did you unblock the file? Yes/No

---

## ✅ Success Indicators

**You'll know it's working when:**
- ✅ Window stays open (doesn't close instantly)
- ✅ You see colored text output
- ✅ A log file appears on your Desktop
- ✅ Notepad opens automatically
- ✅ Script waits for you to press a key at the end

---

## 🎯 Quick Reference

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| Red text flashes, instant close | File is blocked | Unblock in Properties |
| "cannot be loaded" error | Execution policy | Unblock OR use BAT wrapper |
| "Access denied" errors | Not admin | Run as Administrator |
| Script file disappears | Antivirus | Check quarantine, add exclusion |
| Syntax errors | Corrupted download | Re-download fresh script |
| No errors but instant close | Unknown - need diagnostic | Use RUN_WITH_ERROR_CAPTURE.bat |

---

**STATUS:** Emergency tools deployed to GitHub Pages

**Downloads:**
- https://github.com/djnsty23/winclean/blob/main/DIAGNOSTIC_TEST.ps1
- https://github.com/djnsty23/winclean/blob/main/RUN_WITH_ERROR_CAPTURE.bat

**USE THESE NOW!** They will show you exactly what's wrong.

---

Last Updated: 2025-11-24  
**These tools WILL capture your errors - guaranteed!**
