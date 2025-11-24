# Windows 11 Optimizer

A comprehensive, user-friendly tool to optimize Windows 11 performance, privacy, and disk space.

## 🚀 Quick Start

1. Open `index.html` in your browser
2. Select the optimizations you want
3. Click "Generate Optimization Script"
4. Download both generated scripts to the same folder as `Windows_Optimizer_Launcher.bat`
5. **Run ONLY the .bat file** - it handles everything with admin privileges
6. Choose what you want to do from the menu

**IMPORTANT**: Always use the `.bat` launcher - don't run `.ps1` files directly! The launcher automatically elevates to admin and manages all operations.

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

### 1. Generate Scripts
- Open `index.html` in any browser
- Select your desired optimizations
- Click "Generate Optimization Script"
- Download BOTH scripts:
  - `Windows_Optimizer_[timestamp].ps1` - One-time full optimization
  - `Windows_Optimizer_SCHEDULED_[timestamp].ps1` - Recurring maintenance only

### 2. Run with Launcher (THE ONLY WAY)
**Always use `Windows_Optimizer_Launcher.bat`** - it's the single entry point that:
- ✅ Automatically elevates to Administrator
- ✅ Handles all PowerShell execution with proper permissions
- ✅ Provides a clean menu interface
- ✅ Shows results and logs
- ✅ Manages restore operations

**Never run `.ps1` files directly** - they won't have proper admin rights!

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
1. Generate Scripts (index.html)
   └─> Downloads: Windows_Optimizer_[date].ps1
   └─> Downloads: Windows_Optimizer_SCHEDULED_[date].ps1

2. Run Launcher (Windows_Optimizer_Launcher.bat) ← ALWAYS START HERE
   ├─> Auto-elevates to Administrator
   └─> Shows menu with 6 options

3. Choose Operation:
   ├─> [1] One-Time Optimization
   │   ├─> Runs Windows_Optimizer_[date].ps1
   │   ├─> Creates backup automatically
   │   ├─> Shows progress in real-time
   │   └─> Opens log when complete
   │
   ├─> [2] Schedule Maintenance
   │   ├─> Uses Windows_Optimizer_SCHEDULED_[date].ps1
   │   ├─> Choose: Daily/Weekly/Monthly
   │   ├─> Set time (0-23 hours)
   │   └─> Creates Windows Task
   │
   ├─> [3] View Last Log
   │   └─> Opens most recent log in Notepad
   │
   ├─> [4] View Startup Report
   │   └─> Opens HTML report in browser
   │
   ├─> [5] Restore Settings
   │   ├─> Lists all backup points
   │   ├─> Runs restore with admin
   │   └─> Shows results
   │
   └─> [6] Exit
```

**KEY RULE**: ⚠️ Always use the `.bat` launcher - never run `.ps1` files directly!

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
├── index.html                          # Web UI for script generation
├── optimizer.js                        # Script generation logic
├── Windows_Optimizer_Launcher.bat     # Main launcher (auto-admin)
├── README.md                           # This file
├── QUICK_START.md                      # Quick reference guide
├── FEATURES.md                         # Detailed feature list
└── LICENSE                             # MIT License
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
