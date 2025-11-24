# Quick Start Guide

## 3-Step Process

### Step 1: Generate Scripts
1. Open `index.html` in any web browser
2. Check the optimizations you want
3. Click **"Generate Optimization Script"**
4. Download **BOTH** scripts that appear

### Step 2: Run Launcher (ALWAYS USE THIS)
1. **Double-click `Windows_Optimizer_Launcher.bat`** (NOT the .ps1 files!)
2. Click "Yes" when Windows asks for admin permission
3. Choose an option from the menu

⚠️ **CRITICAL**: Always use the BAT launcher! It automatically:
- Requests admin privileges
- Runs all scripts with proper permissions
- Handles restore operations correctly
- Shows all results in one place

### Step 3: Enjoy Optimized System!

---

## Menu Options Explained

### [1] Run One-Time Optimization Now
- Runs ALL your selected optimizations immediately
- Creates backup before making changes
- Shows detailed progress
- Opens log file when complete
- **Use this for your first run**

### [2] Schedule Recurring Maintenance
- Sets up automatic cleanup (temp files, logs, etc.)
- Choose how often: Daily, Weekly, or Monthly
- Set what time it should run
- Runs silently in background
- **Use this for hands-free maintenance**

### [3] View Last Optimization Log
- See what was cleaned/changed
- Review space freed
- Check for any errors

### [4] View Startup Programs Report
- HTML report of all startup programs
- Recommendations for each program
- Helps you disable unnecessary startup items

### [5] Restore Previous Settings
- Undo changes from a specific run
- Choose which backup to restore
- Safe way to revert if needed

---

## Scheduling Recommendations

| Frequency | Best For |
|-----------|----------|
| **Daily** | Heavy computer use, lots of downloads |
| **Weekly** | Normal use (Recommended) |
| **Monthly** | Light use |

**Recommended Time**: 2 AM (computer idle)

---

## What's Safe to Enable?

### Always Safe ✅
- All temp file cleanups
- Recycle bin
- Old Windows updates
- System logs

### Usually Safe ✅
- Telemetry minimization
- Advertising ID disable
- Prefetch cleanup
- Game Mode enable

### Consider Carefully ⚠️
- Cortana disable (if you use voice commands)
- Windows Search to Manual (may slow file searches)
- Hibernation disable (if you use hibernate)
- Component Store cleanup (takes 5-10 minutes)

---

## First Run Checklist

- [ ] Generated both scripts from index.html
- [ ] Both .ps1 files are in the same folder as the .bat launcher
- [ ] Running Windows_Optimizer_Launcher.bat
- [ ] Allowed admin access
- [ ] Selected option [1] for first optimization
- [ ] Reviewed the log file after completion
- [ ] (Optional) Set up option [2] for weekly maintenance

---

## Troubleshooting

**Launcher won't start?**
- Make sure you're double-clicking the `.bat` file, not a `.ps1` file
- If UAC doesn't appear, right-click → "Run as administrator"

**Scripts not found?**
- Make sure both .ps1 files are in the SAME folder as the .bat file
- File names should be: `Windows_Optimizer_[date].ps1` and `Windows_Optimizer_SCHEDULED_[date].ps1`

**Restore not working?**
- DON'T run restore .ps1 directly!
- Use the launcher menu option [5] - it handles admin rights automatically

**Want to undo changes?**
- Run the launcher
- Choose option [5]
- Select which restore point to use

**Scheduled task not running?**
- Open Task Scheduler (Win+R → taskschd.msc)
- Find "Windows Optimizer Maintenance"
- Right-click → Properties → Verify settings
- Check "Run with highest privileges" is enabled

---

Need more details? See **README.md** for complete documentation.
