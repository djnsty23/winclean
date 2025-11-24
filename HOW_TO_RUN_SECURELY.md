# 🔒 How to Run Scripts Securely (Without Changing Execution Policy)

## Why You Should NOT Change Execution Policy Globally

**You're right to be cautious!** Changing your PowerShell execution policy to `Bypass` or `RemoteSigned` would allow **ANY** downloaded script to run, including malicious ones.

**DON'T DO THIS:**
```powershell
# ❌ BAD - Allows all downloaded scripts to run forever
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## ✅ Secure Methods (Pick One)

### Method 1: Unblock Individual Files (Recommended)

**This is the MOST SECURE method.** It only allows the specific file you trust to run.

**Steps:**
1. Download the `.ps1` script from our portal
2. Locate it in your Downloads folder
3. **Right-click** the file
4. Select **"Properties"**
5. At the bottom, you'll see: `"This file came from another computer..."`
6. Check the box: **☑ Unblock**
7. Click **Apply** → **OK**
8. Now **right-click** the script → **"Run with PowerShell"** (or "Run as Administrator")

**Why it's secure:**
- Only affects THIS ONE FILE
- Your execution policy stays protected
- Other downloaded scripts are still blocked
- You manually verify each script

**Visual Guide:**
```
┌─────────────────────────────────────┐
│  Script.ps1 Properties              │
├─────────────────────────────────────┤
│  General  |  Security  |  Details   │
├─────────────────────────────────────┤
│                                     │
│  This file came from another        │
│  computer and might be blocked to   │
│  help protect this computer.        │
│                                     │
│  ☑ Unblock    [Apply]  [OK]        │
└─────────────────────────────────────┘
```

---

### Method 2: Use Batch File (No Execution Policy)

**Batch files (.bat) don't have execution policy restrictions.**

1. Download **`SIMPLE_FIX.bat`** from the repository
2. Right-click → **Run as Administrator**
3. Done!

**Why it's secure:**
- BAT files use different execution model
- No execution policy bypass needed
- Still performs the same cleanup

---

### Method 3: One-Time Bypass (Per Execution)

**Run the script with a one-time bypass flag.**

**Steps:**
1. Download the script (e.g., `Windows_Optimizer.ps1`)
2. Right-click the file → **"Copy as path"**
3. Open **PowerShell as Administrator**
4. Paste this command (replace the path):

```powershell
powershell.exe -ExecutionPolicy Bypass -File "C:\Users\YourName\Downloads\Windows_Optimizer.ps1"
```

**Why it's secure:**
- Bypass only applies to THIS ONE execution
- Next time you run a script, policy is enforced again
- No permanent changes to your system

---

### Method 4: Paste Script Contents Directly

**PowerShell allows running scripts directly from the console.**

**Steps:**
1. Download the `.ps1` file
2. Open it in **Notepad**
3. Press **Ctrl+A** (Select All) → **Ctrl+C** (Copy)
4. Open **PowerShell as Administrator**
5. Right-click in the window to paste
6. Press **Enter**

**Why it's secure:**
- Execution policy doesn't apply to pasted commands
- You can review the code before running
- No policy changes needed

---

## 🛡️ Security Comparison

| Method | Security Level | Ease of Use | One-Time Setup |
|--------|---------------|-------------|----------------|
| **Unblock File** | ⭐⭐⭐⭐⭐ Highest | Easy | Per file |
| **BAT File** | ⭐⭐⭐⭐ High | Easiest | None |
| **One-Time Bypass** | ⭐⭐⭐⭐ High | Medium | Per run |
| **Paste in Console** | ⭐⭐⭐⭐⭐ Highest | Advanced | None |
| ~~Global Policy Change~~ | ⭐ **AVOID** | Easy | Once (bad) |

---

## 🔍 How to Verify Scripts Are Safe

Before unblocking or running any script:

1. **Open in Notepad** and review the code
2. **Look for:**
   - ✅ Clear comments explaining what it does
   - ✅ Standard PowerShell cmdlets (Get-, Set-, Remove-)
   - ✅ File paths you recognize (Desktop, Temp folders)
   - ❌ Obfuscated code (random characters, base64)
   - ❌ Downloads from unknown URLs
   - ❌ Connects to external servers

3. **Our scripts are:**
   - Fully commented
   - Human-readable
   - Open source (you can see the generator code)
   - No network connections
   - No data collection

---

## 💡 Why Execution Policy Exists

PowerShell execution policy is a **safety feature** that prevents:
- Accidentally running malicious scripts
- Scripts from running without your knowledge
- Attackers using PowerShell to compromise your system

**Keeping it enabled = Good security practice!** ✅

---

## 🎯 Our Recommendation

**For maximum security:**

1. **Use Method 1 (Unblock)** for our optimization scripts
2. **Keep your execution policy at default** (`Restricted` or `RemoteSigned`)
3. **Review scripts before unblocking** them
4. **Delete scripts after use** (or keep them in a secure folder)

**For maximum convenience:**

1. **Use Method 2 (BAT file)** for quick temp cleaning
2. **No security compromises**
3. **Works every time**

---

## 📋 Quick Reference Commands

### Check Current Execution Policy
```powershell
Get-ExecutionPolicy
```

### Run Script Once Without Changing Policy
```powershell
powershell.exe -ExecutionPolicy Bypass -File ".\script.ps1"
```

### Unblock File via PowerShell (if you prefer command line)
```powershell
Unblock-File -Path "C:\Users\YourName\Downloads\script.ps1"
```

---

## ❓ FAQ

**Q: Will unblocking one file affect other scripts?**  
A: No! Unblocking only affects that specific file.

**Q: Do I need to unblock every script I download from your portal?**  
A: Yes, but it only takes 3 seconds per file (right-click → Properties → Unblock).

**Q: Can I use the BAT file for everything?**  
A: The BAT file only does temp cleaning. For other optimizations (privacy, services, etc.), use the PowerShell scripts.

**Q: Is there a way to trust ONLY your scripts permanently?**  
A: Yes! Advanced users can use **code signing** with self-signed certificates, but it's complex. The "Unblock" method is simpler and equally secure for individual files.

**Q: What if I accidentally changed my execution policy already?**  
A: Reset it to secure default:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Restricted
```

---

## 🎓 Learn More

- [Microsoft: About Execution Policies](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)
- [Security Best Practices for PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/security/preventing-script-injection)

---

**Bottom Line:** You were RIGHT to question changing the execution policy. Use the secure methods above! 🔒

**Remember:** Our scripts are open source and safe, but it's GOOD practice to verify scripts before running them and keep your execution policy restrictive.
