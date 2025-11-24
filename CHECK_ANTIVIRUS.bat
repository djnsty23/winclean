@echo off
REM Check Windows Defender and system restrictions

echo.
echo ========================================
echo   ANTIVIRUS AND SECURITY CHECK
echo ========================================
echo.

echo Checking Windows Defender status...
echo.
powershell -Command "Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled, IoavProtectionEnabled, BehaviorMonitorEnabled" 2>&1

echo.
echo ========================================
echo.
echo Checking Windows Defender threat history...
echo (Looking for blocked PowerShell scripts)
echo.
powershell -Command "Get-MpThreat | Select-Object ThreatName, Resources, InitialDetectionTime | Format-List" 2>&1

echo.
echo ========================================
echo.
echo Checking PowerShell execution policy...
echo.
powershell -Command "Get-ExecutionPolicy -List" 2>&1

echo.
echo ========================================
echo.
echo Checking if PowerShell transcription is enabled...
echo (This might reveal why scripts are failing)
echo.
powershell -Command "Get-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\Transcription' -ErrorAction SilentlyContinue" 2>&1

echo.
echo ========================================
echo.
echo Checking AppLocker policies...
echo (These can block script execution)
echo.
powershell -Command "Get-AppLockerPolicy -Effective -Xml | Out-String" 2>&1

echo.
echo ========================================
echo   CHECK COMPLETE
echo ========================================
echo.
echo If you see errors above, your system has restrictions
echo that are preventing PowerShell scripts from running.
echo.
pause
