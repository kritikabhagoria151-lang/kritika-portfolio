@echo off
echo.
echo ============================================
echo   Stopping Kritika Portfolio Dev Server
echo ============================================
echo.

set "PORT=5173"

for /f "tokens=5" %%p in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
    echo Port %PORT% process PID %%p ko band kar rahe hain...
    taskkill /PID %%p /F >nul 2>&1
)

echo.
echo Server band ho gaya.
echo.
timeout /t 3 >nul
exit