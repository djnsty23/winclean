# Windows 11 Optimizer

A comprehensive, user-friendly tool to optimize Windows 11 performance, privacy, and disk space.

## 🚀 Quick Start

1. Open `index.html` in your browser
2. Select the optimizations you want
3. Click "Generate My Optimizer"
4. Download all 3 files (downloads automatically):
   - `START_HERE_Windows_Optimizer.bat` ← **Run this one!**
   - `Windows_Optimizer_OneTime.ps1` (used automatically)
   - `Windows_Optimizer_Scheduled.ps1` (used automatically)
5. **Keep all 3 files in the same folder**
6. **Right-click `START_HERE_Windows_Optimizer.bat`** → **Run as Administrator**
7. Select from the interactive menu

**IMPORTANT**: Only run the START_HERE .bat file! The .ps1 files are used automatically.

## ✨ Features

### One-Time Optimizations
- **Temp Files Cleanup**: User temp, Windows temp, prefetch, thumbnails, recycle bin
- **Privacy Settings**: Disable telemetry, ads, Cortana, location tracking
- **Performance Tuning**: Optimize visual effects, enable Game Mode, disable superfetch
- **Disk Maintenance**: Clean WinSxS, remove old updates, clear system logs
- **Services**: Optimize DiagTrack, SysMain, Windows Search
- **Startup Analysis**: Generate HTML report of startup programs

### Recurring Maintenance (Scheduled)
- **Temp Files**: Automatic cleanup of accumulated temporary files
- **Windows Updates**: Remove old update files periodically
- **System Logs**: Clear old event logs to save space

## 📋 How It Works

### 1. Generate Your Custom Optimizer
- Open `index.html` in any browser
- Select your desired optimizations
- Click "Generate My Optimizer"
- 3 files download automatically:
  - `Windows_Optimizer.bat` - Interactive launcher
  - `Windows_Optimizer_OneTime.ps1` - Full optimization
  - `Windows_Optimizer_Scheduled.ps1` - Recurring tasks only

### 2. Run the BAT File as Administrator
**Right-click `Windows_Optimizer.bat` → Run as Administrator**

The launcher provides an interactive menu:
- ✅ [1] Run optimization now (executes OneTime script)
- ✅ [2] Schedule recurring maintenance (sets up scheduled tasks)
- ✅ [3] View last log file
- ✅ [4] View startup programs report
- ✅ [5] Restore previous settings
- ✅ [6] Exit

**Never run `.ps1` files directly** - always use the .bat launcher!

```
[1] Run One-Time Optimization Now
    - Runs all selected optimizations immediately
    - Creates backup and restore point
    - Generates detailed log and reports

[2] Schedule Recurring Maintenance
    - Choose frequency: Daily/Weekly/Monthly
    - Set execution time (0-23 hours)
    - Only runs tasks that benefit from repetition
    - Runs silently in background

[3] View Last Optimization Log
    - Opens the most recent log file
    - Shows what was cleaned and optimized

[4] View Startup Programs Report
    - Opens HTML report in browser
    - Shows all startup programs with recommendations

[5] Restore Previous Settings
    - Lists all available restore points
    - Reverts changes from a specific optimization run

[6] Exit
```

### 3. Automatic Admin Elevation
The launcher automatically requests administrator privileges - no manual "Run as Admin" needed!

## 🔒 Safety Features

### Backup System
Every optimization run creates:
- **Backup JSON**: Original registry/service settings
- **Restore Script**: One-click restoration of previous state
- **Detailed Log**: Complete record of all actions taken

### Smart Task Separation
- **One-Time Tasks**: Privacy settings, service configs, performance tweaks
- **Recurring Tasks**: Only temp cleanup and maintenance tasks
- **Prevention**: Settings won't be repeatedly changed by scheduled tasks

## 🔄 Complete Workflow

```
1. Generate Your Optimizer (index.html)
   └─> Downloads 3 files:
       ├─> START_HERE_Windows_Optimizer.bat ← RUN THIS!
       ├─> Windows_Optimizer_OneTime.ps1 (auto-used)
       └─> Windows_Optimizer_Scheduled.ps1 (auto-used)

2. Run Launcher (START_HERE_Windows_Optimizer.bat) ← RIGHT-CLICK → RUN AS ADMIN
   ├─> Checks for admin privileges
   ├─> Verifies PS1 files are present
   └─> Shows interactive menu

3. Choose from Menu:
   ├─> [1] Run Optimization Now
   │   ├─> Executes Windows_Optimizer_OneTime.ps1
   │   ├─> Creates backup (if enabled)
   │   ├─> Shows progress in real-time
   │   └─> Saves log to script folder
   │
   ├─> [2] Schedule Recurring Maintenance
   │   ├─> Executes Windows_Optimizer_Scheduled.ps1
   │   ├─> Choose: Daily/Weekly/Monthly
   │   ├─> Set time (0-23 hours)
   │   ├─> Choose: Hidden/Visible window
   │   └─> Creates Windows scheduled task
   │
   ├─> [3] View Last Log
   │   └─> Opens most recent WinOptimizer_*.log in Notepad
   │
   ├─> [4] View Startup Report
   │   └─> Opens StartupPrograms_*.txt in Notepad
   │
   ├─> [5] Restore Previous Settings
   │   ├─> Lists all RESTORE_*.ps1 files
   │   ├─> Runs selected restore script
   │   └─> Shows results
   │
   └─> [6] Exit
```

**KEY RULES**: 
- ⚠️ Keep all 3 files in the same folder
- ⚠️ Only run START_HERE_Windows_Optimizer.bat as Administrator
- ⚠️ Never run .ps1 files directly - they're used automatically!

## 📊 What Gets Optimized

### Temp Files Cleanup
- `%TEMP%` - User temporary files
- `C:\Windows\Temp` - System temporary files
- `C:\Windows\Prefetch` - Prefetch cache
- Thumbnail cache
- Recycle Bin

### Privacy Enhancements
- Minimize Windows telemetry
- Disable advertising ID
- Disable Cortana
- Disable location tracking

### Performance Improvements
- Optimize visual effects for performance
- Enable Game Mode
- Disable Superfetch (SSD optimization)
- Disable Hibernation (frees disk space)

### Disk Maintenance
- Clean WinSxS component store
- Remove old Windows Update files
- Clear system event logs

### Service Optimization
- Disable DiagTrack (telemetry)
- Set SysMain to Manual
- Set Windows Search to Manual

## 🗂️ Project Structure

```
winclean-1/
├── index.html                       # Web UI for script generation
├── optimizer.js                     # Script generation logic
├── README.md                        # This file
├── QUICK_START.md                   # Quick reference guide
├── FEATURES.md                      # Detailed feature list
└── LICENSE                          # MIT License

Generated files (downloaded):
├── START_HERE_Windows_Optimizer.bat ← RUN THIS ONE!
├── Windows_Optimizer_OneTime.ps1    # Auto-used by BAT
└── Windows_Optimizer_Scheduled.ps1  # Auto-used by BAT
```

## ⚙️ Advanced Usage

### Manual Script Execution
If you prefer not to use the launcher:

```powershell
# One-time optimization
powershell -ExecutionPolicy Bypass -File "Windows_Optimizer_[timestamp].ps1"

# Or with admin check
powershell -ExecutionPolicy Bypass -Command "Start-Process powershell -Verb RunAs -ArgumentList '-ExecutionPolicy Bypass -File \"Windows_Optimizer_[timestamp].ps1\"'"
```

### Custom Scheduling
The launcher creates tasks via `schtasks`, but you can also use Task Scheduler (taskschd.msc) for advanced options.

## 🛡️ Security

- All scripts are generated locally in your browser
- No data is sent to external servers
- Source code is fully visible and auditable
- Creates backups before any changes
- Uses Windows built-in commands only

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## ⚠️ Disclaimer

This tool modifies system settings. While it creates backups and uses safe methods:
- Always backup important data before system modifications
- Test in a non-production environment first
- Review generated scripts before running
- Use at your own risk

## 💡 Tips

1. **First Run**: Use option [1] to do a full optimization
2. **Maintenance**: Use option [2] to schedule weekly cleanup
3. **Review**: Check logs after each run to see what changed
4. **Restore**: Keep restore scripts in case you need to revert
5. **Startup**: Review the startup report to disable unnecessary programs

---

**Version**: 2.0  
**Last Updated**: November 2025  
**Compatible With**: Windows 11 (22H2 and later)
