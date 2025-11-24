# 🎯 HOW TO RUN THE SCRIPT (NO DRAGGING!)

## The Problem

Your system doesn't handle drag-and-drop file paths correctly in batch files. That's why everything was closing instantly!

---

## ✅ **METHOD 1: Use the Automatic Runner** (EASIEST!)

1. Download **`RUN_OPTIMIZER.bat`** from GitHub
2. Download an **optimization script** from the web portal
3. **Move `RUN_OPTIMIZER.bat` to your Downloads folder**
4. **Double-click `RUN_OPTIMIZER.bat`**

It will automatically find and run the newest Windows_Optimizer script in your Downloads folder!

---

## ✅ **METHOD 2: Run PowerShell Directly**

1. Press `Win + R`
2. Type: `powershell`
3. Press Enter
4. In the PowerShell window, type:
   ```powershell
   cd Downloads
   ```
5. Press Enter
6. Then type (replace with YOUR actual filename):
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\Windows_Optimizer_2025-11-24_XX-XX-XX.ps1
   ```
7. Press Enter

The script will run and stay open!

---

## ✅ **METHOD 3: Properties → Unblock → Right-Click Run**

1. Download the `.ps1` script
2. **Right-click** the script → **Properties**
3. At the bottom, check **Unblock** → **Apply** → **OK**
4. **Right-click** the script → **Run with PowerShell**

This should work now that we know Desktop write protection was the issue!

---

## ✅ **METHOD 4: Use PowerShell ISE**

1. Press `Win + R`
2. Type: `powershell_ise`
3. Press Enter
4. File → Open
5. Select your `Windows_Optimizer_*.ps1` file
6. Press **F5** to run

---

## 📁 **Remember: Files Save in Downloads Folder Now!**

Since your Desktop has write protection, all output files (logs, backups, restore scripts) will be saved **in the same folder as the script** (your Downloads folder).

---

## 🎯 **Try METHOD 1 First!**

Download `RUN_OPTIMIZER.bat`, move it to Downloads, and double-click it. No dragging needed! 🚀
