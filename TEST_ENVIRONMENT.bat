@echo off
REM ============================================
REM Test PowerShell Environment
REM ============================================

echo.
echo ========================================
echo   PowerShell Environment Test
echo ========================================
echo.

echo Testing PowerShell version...
powershell -Command "$PSVersionTable.PSVersion"

echo.
echo Testing execution policy...
powershell -Command "Get-ExecutionPolicy -List"

echo.
echo Testing if PowerShell can run simple commands...
powershell -Command "Write-Host 'SUCCESS: PowerShell works!' -ForegroundColor Green"

echo.
echo Testing if PowerShell can create files on Desktop...
powershell -Command "try { 'test' | Out-File -FilePath \"$env:USERPROFILE\Desktop\PS_TEST.txt\" -Force; Write-Host 'SUCCESS: Can write to Desktop' -ForegroundColor Green; Remove-Item \"$env:USERPROFILE\Desktop\PS_TEST.txt\" -Force } catch { Write-Host 'FAILED: Cannot write to Desktop' -ForegroundColor Red }"

echo.
echo Testing if scripts can run...
echo Write-Host "If you see this, scripts work!" -ForegroundColor Green > "%TEMP%\test.ps1"
echo Read-Host "Press Enter" >> "%TEMP%\test.ps1"
powershell -ExecutionPolicy Bypass -File "%TEMP%\test.ps1"
del "%TEMP%\test.ps1"

echo.
echo ========================================
echo   All Tests Complete
echo ========================================
echo.
pause
