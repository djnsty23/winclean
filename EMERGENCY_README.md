# 🚨 EMERGENCY TROUBLESHOOTING

## Your scripts are being BLOCKED by your system!

Even the diagnostic BAT files are closing instantly, which means **PowerShell execution is being blocked at a system level**.

---

## 🔍 **Step 1: Check What's Blocking PowerShell**

Download and run **`CHECK_ANTIVIRUS.bat`**

This will show you:
- ✅ Windows Defender status
- ✅ Blocked/quarantined files
- ✅ Execution policies
- ✅ AppLocker restrictions

**Send me a screenshot of the output!**

---

## 🔍 **Step 2: Test PowerShell Directly**

1. Download **`SIMPLE_TEST.ps1`** (only 3 lines)
2. Right-click → **Properties** → **Unblock** → Apply → OK
3. Download **`SHOW_ERROR.bat`**
4. Run `SHOW_ERROR.bat`
5. Drag `SIMPLE_TEST.ps1` into it
6. Press Enter

**This BAT file will NEVER close automatically!**

It will show you:
- Whether the file exists
- Whether PowerShell.exe exists
- The exact error message (if any)
- The exit code

---

## 🔍 **Step 3: Check Windows Defender**

1. Open **Windows Security**
2. Go to **Virus & threat protection**
3. Click **Protection history**
4. Look for any `.ps1` files that were blocked/quarantined
5. **Screenshot it and send to me!**

---

## 🔍 **Step 4: Check Event Viewer**

If scripts are being blocked by Group Policy or AppLocker:

1. Press `Win + X` → **Event Viewer**
2. Go to **Windows Logs** → **Application**
3. Look for **PowerShell** errors in the last hour
4. Screenshot any red error entries

---

## ⚠️ **Possible Causes**

Based on symptoms, your system likely has:

1. **Windows Defender SmartScreen** blocking downloaded scripts
2. **Antivirus software** blocking PowerShell execution
3. **Group Policy** restrictions (if this is a work/school PC)
4. **AppLocker** policies preventing script execution
5. **Controlled Folder Access** preventing file writes

---

## 🔧 **Quick Fixes to Try**

### Fix 1: Add PowerShell to Exclusions

1. Windows Security → Virus & threat protection
2. Manage settings → Exclusions
3. Add exclusion → **Folder**
4. Add: `C:\Windows\System32\WindowsPowerShell\v1.0\`

### Fix 2: Temporarily Disable Real-Time Protection

1. Windows Security → Virus & threat protection
2. Manage settings
3. **Turn off** Real-time protection (temporarily!)
4. Try running script immediately
5. **Turn protection back on** after testing

### Fix 3: Run from Different Location

1. Create a folder: `C:\Scripts\`
2. Move `.ps1` file there
3. Run from that location (not Downloads)

### Fix 4: Use PowerShell ISE Instead

1. Press `Win + R`
2. Type: `powershell_ise.exe`
3. Press Enter
4. File → Open → Select your `.ps1` file
5. Press F5 to run

---

## 📸 **Send Me These**

1. Screenshot of `CHECK_ANTIVIRUS.bat` output
2. Screenshot of Windows Defender Protection History
3. Output from `SHOW_ERROR.bat` when running `SIMPLE_TEST.ps1`

This will tell me **EXACTLY** what's blocking execution!

---

**Is this a work computer or school computer?** If yes, your IT department may have policies preventing script execution entirely.
