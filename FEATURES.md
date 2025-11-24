# Windows 11 Optimizer - Features

## 🎯 Core Features

### 1. Dual-Script Generation
Generates two optimized scripts:
- **One-Time Script**: Complete optimization with all selected features
- **Scheduled Script**: Only recurring tasks for automated maintenance

### 2. Intelligent Task Separation
Automatically separates tasks into:
- **One-Time Only**: Privacy settings, service configs, performance tweaks
- **Recurring**: Temp cleanup, log clearing, update removal

### 3. Menu-Driven Launcher
User-friendly BAT file with:
- Auto-elevation to admin
- Interactive menu system
- Multiple scheduling options
- Built-in restore functionality

---

## 🧹 Optimization Categories

### Temp Files Cleanup (Recurring)
| Location | Description | Typical Space Saved |
|----------|-------------|---------------------|
| User Temp (`%TEMP%`) | Temporary application files | 100-500 MB |
| Windows Temp | System temporary files | 10-100 MB |
| Prefetch Cache | Application prefetch data | 5-20 MB |
| Thumbnail Cache | Image thumbnails | 10-100 MB |
| Recycle Bin | Deleted files | Varies |

**Recurring**: Yes - files accumulate over time

### Privacy Settings (One-Time)
| Setting | Effect |
|---------|--------|
| Telemetry | Set to minimum level |
| Advertising ID | Completely disabled |
| Cortana | Disabled via registry |
| Location Tracking | Denied system-wide |

**Recurring**: No - settings persist once changed

### Performance Tuning (One-Time)
| Optimization | Benefit | Impact |
|--------------|---------|--------|
| Visual Effects | Faster UI response | Removes animations |
| Game Mode | Better gaming performance | Prioritizes games |
| Superfetch Disable | SSD optimization | Reduces disk I/O |
| Hibernation Disable | Frees disk space | Removes hiberfil.sys |

**Recurring**: No - system settings remain changed

### Disk Maintenance (Mixed)
| Task | Type | Time Required |
|------|------|---------------|
| WinSxS Cleanup | One-Time | 5-10 minutes |
| Old Updates | Recurring | 1-2 minutes |
| Event Logs | Recurring | 30 seconds |

### Service Optimization (One-Time)
| Service | Change | Impact |
|---------|--------|--------|
| DiagTrack | Disabled | Stops telemetry collection |
| SysMain (Superfetch) | Manual | Reduces background disk usage |
| Windows Search | Manual | Saves CPU/RAM (slower searches) |

**Recurring**: No - service startup type persists

### Startup Analysis (On-Demand)
- Scans registry startup locations
- Generates HTML report
- Provides recommendations
- Categorizes by safety

**Recurring**: No - run when needed

---

## 🔄 Scheduling Features

### Frequency Options
- **Daily**: Runs every day at specified hour
- **Weekly**: Runs every Sunday at specified hour (recommended)
- **Monthly**: Runs on 1st of month at specified hour

### Time Selection
- Choose any hour (0-23)
- Recommended: 2 AM (system idle)
- Runs silently in background
- Creates logs for review

### Automatic Execution
- No user interaction required
- Runs with SYSTEM privileges
- Hidden window (no popup)
- Logs saved for review

---

## 🛡️ Safety & Backup

### Automatic Backup System
Every optimization creates:
1. **Backup JSON** (2-3 KB)
   - Registry values
   - Service states
   - System settings

2. **Restore Script** (3-4 KB)
   - One-click restoration
   - Reverses all changes
   - Safe and tested

3. **Detailed Log** (varies)
   - Every action logged
   - Timestamps included
   - Error tracking

### Restore Functionality
- List all available backups
- Choose specific restore point
- Automatic restoration
- Verification of changes

---

## 📊 Reporting

### Optimization Log
```
=============================================================
Windows 11 Optimization Script - OPTIMIZATION MODE
Started: 2025-11-24 14:48:49
=============================================================

[STATS] FINAL SUMMARY:
   SUCCESS: Items processed: 492
   [DISK] Space freed: 260.89 MB

Full log saved to: Windows_Optimization_Log_[timestamp].txt
```

### Startup Report (HTML)
- All startup programs listed
- Launch location shown
- Safety recommendations
- Color-coded categories

---

## 🎛️ Customization

### Web Interface
- Visual checkboxes for each option
- Category grouping
- Preview mode available
- Generates both scripts at once

### Launcher Menu
- Run immediate optimization
- Schedule maintenance
- View logs
- Access reports
- Restore settings

---

## 🔧 Technical Details

### PowerShell Features
- Error handling with try-catch
- Progress tracking
- Detailed logging
- Safe file operations
- Registry backup

### Execution Policies
- Uses `-ExecutionPolicy Bypass`
- No permanent policy changes
- Per-execution basis
- Secure and contained

### Admin Privileges
- Auto-elevation via launcher
- Manual elevation supported
- Checks privileges before running
- Warns if insufficient rights

---

## 📈 Performance Impact

### Immediate Benefits
- Faster boot time (startup optimization)
- More disk space (cleanup)
- Snappier UI (visual effects)
- Better gaming (Game Mode)

### Long-Term Benefits
- Consistent performance (scheduled cleanup)
- Reduced tracking (privacy settings)
- Lower background usage (service optimization)

---

## 🚫 What We DON'T Do

- **No uninstalling**: We don't remove Windows apps
- **No registry hacks**: Only official settings
- **No third-party tools**: Windows built-ins only
- **No risky changes**: All reversible
- **No data loss**: Comprehensive backups

---

## 📋 Version History

### v2.0 (Current)
- Dual-script generation
- Smart task separation
- Menu-driven launcher
- Flexible scheduling
- Auto-elevation

### v1.0
- Basic optimization script
- Manual execution required
- Fixed scheduling
- Limited backup

---

## 🔮 Planned Features

- [ ] GUI launcher (Windows Forms)
- [ ] Custom scheduling rules
- [ ] Email notifications
- [ ] Network optimizations
- [ ] Battery optimization mode
- [ ] Game-specific profiles

---

**Note**: All features are optional and can be enabled/disabled via the web interface before script generation.
