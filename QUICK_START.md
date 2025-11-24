# Quick Start Guide

## 3 Simple Steps

### Step 1: Generate Your Optimizer
1. Open `index.html` in any web browser
2. **Quick Actions** (new!):
   - Click **"Apply Recommended Settings"** for instant safe optimization
   - Or click **"Select All"** or **"Clear All"**
   - Or manually select your optimizations
3. Click **"Generate My Optimizer"**
4. **3 files download automatically**:
   - `START_HERE_Windows_Optimizer.bat` - **Run this one!**
   - `Windows_Optimizer_OneTime.ps1` (used automatically)
   - `Windows_Optimizer_Scheduled.ps1` (used automatically)

### Step 2: Run as Administrator
1. Navigate to your Downloads folder
2. **Right-click `START_HERE_Windows_Optimizer.bat`**
3. Select **"Run as Administrator"**
4. You'll see an interactive menu with 6 options

**CRITICAL**: All 3 files must be in the same folder! Only run START_HERE .bat file!

### Step 3: Choose What to Do
- **[1]** Run optimization now
- **[2]** Schedule recurring maintenance
- **[3]** View last log
- **[4]** View startup report
- **[5]** Restore previous settings
- **[6]** Exit

---

## Menu Options Explained

### [1] Run Optimization Now
- Executes ALL your selected optimizations immediately
- Creates backup before making changes (if enabled)
- Shows detailed progress in console
- Saves log file to Desktop
- **Use this for your first run**

### [2] Schedule Recurring Maintenance
- Sets up automatic cleanup (temp files, browser caches, logs, disk cleanup, WinSxS)
- System repair (DISM+SFC) runs monthly only (first week)
- Choose frequency: Daily, Weekly, or Monthly
- Select time to run (0-23 hours)
- Choose visibility: Hidden (silent) or Show Window
- Creates Windows scheduled task
- Logs saved to script folder
- **Use this for hands-free maintenance**

### [3] View Last Log
- Opens most recent WinOptimizer_*.log file
- See what was cleaned/changed
- Review space freed
- Check for any errors

### [4] View Startup Report
- Opens StartupPrograms_*.txt file
- List of all startup programs
- Helps you identify what to disable manually

### [5] Restore Previous Settings
- Undo changes from a specific optimization run
- Choose which backup point to restore
- Safe way to revert if something doesn't work right

---

## Scheduling Recommendations

| Frequency | Best For | Recommended Time |
|-----------|----------|------------------|
| **Daily** | Heavy computer use, lots of downloads | 3 AM |
| **Weekly** | Normal use (Recommended) | Sunday 3 AM |
| **Monthly** | Light use | 1st of month, 3 AM |

**Why 3 AM?** Computer is typically idle, won't interrupt your work.

---

## What's Safe to Enable?

### Always Safe
- All temp file cleanups
- Browser cache cleanup (Edge, Chrome, Brave, Opera)
- Recycle bin emptying
- Old Windows update cleanup
- System log clearing
- System file repair (DISM + SFC)

### Usually Safe
- Telemetry minimization
- Advertising ID disable
- Prefetch cleanup
- Game Mode enable
- SysMain/Superfetch to Manual (recommended for SSDs)

### Consider Carefully
- Cortana disable (if you use voice commands)
- Windows Search to Manual (may slow file searches)
- Hibernation disable (if you use hibernate feature)
- Component Store cleanup (WinSxS - takes 5-10 minutes, but can be scheduled)

---

## First Run Checklist

- [ ] Generated optimizer from index.html
- [ ] All 3 files downloaded to same folder
- [ ] Right-clicked START_HERE_Windows_Optimizer.bat
- [ ] Selected "Run as Administrator"
- [ ] Chose option [1] for first optimization
- [ ] Reviewed the log file (saved in same folder as BAT)
- [ ] (Optional) Set up option [2] for weekly maintenance
- [ ] (Optional) Choose "Hidden" mode for silent scheduled tasks

---

## Troubleshooting

**"ADMIN PRIVILEGES REQUIRED" message?**
- Right-click the .bat file and select "Run as Administrator"
- Don't just double-click it

**"Cannot find Windows_Optimizer_OneTime.ps1"?**
- Make sure all 3 downloaded files are in the SAME folder
- Check file names match exactly

**Scripts close immediately?**
- You must right-click the .bat file
- Select "Run as Administrator"

**Want to undo changes?**
- Run the launcher (right-click > Run as Admin)
- Choose option [5] (Restore Previous Settings)
- Select which backup point to restore from

**Scheduled task not running?**
- Open Task Scheduler (Win+R > `taskschd.msc`)
- Find "WindowsOptimizerMaintenance"
- Right-click > Properties > Verify settings
- Ensure "Run with highest privileges" is checked

---

## 📁 File Organization

After downloading, your folder should look like this:

```
Downloads/
- START_HERE_Windows_Optimizer.bat    - Right-click this, Run as Admin!
- Windows_Optimizer_OneTime.ps1       - Used automatically
- Windows_Optimizer_Scheduled.ps1     - Used automatically
```

**All 3 files MUST stay together!**

---

## Pro Tips

1. **First Run**: Enable the backup option for safety
2. **System Repair**: Enable DISM+SFC for monthly automated Windows repair
3. **Browser Cache**: Close all browsers before running cleanup for best results
4. **Scheduling**: Set maintenance to 3 AM for no interruptions
5. **Hidden Tasks**: Use "Hidden (Silent)" mode for scheduled tasks to avoid interruptions
6. **Logs**: All logs are saved in the same folder as your BAT file for easy access
7. **Startup**: Use the startup report to disable bloatware
8. **Restore**: Keep restore scripts for at least 30 days (saved in script folder)
9. **Weekly**: Most users benefit from weekly scheduled maintenance
10. **WinSxS**: Include it in scheduled tasks for deep cleanup every week/month
11. **Monthly Repair**: System repair automatically runs monthly only (first week) to avoid unnecessary overhead

---

**Need more details?** See [README.md](README.md) for complete documentation.
