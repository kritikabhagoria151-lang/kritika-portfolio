@echo off
setlocal
cd /d "%~dp0"

title Kritika Portfolio - Dev Server

echo.
echo ==============================================
echo    Kritika Portfolio  -  Dev Server
echo ==============================================
echo.

set "PORT=5173"
set "BASE_PATH=/"

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js nahi mila.
    echo         https://nodejs.org se install kar lein,
    echo         phir ye file dobara double-click karein.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [1/2] node_modules nahi mila.
    echo      Pehli baar me 2-3 minute lag sakte hain. Please wait...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install fail ho gaya.
        echo         Internet check karke dobara try karein.
        echo.
        pause
        exit /b 1
    )
) else (
    echo [1/2] node_modules mil gaya - install skip kar diya.
)

echo.
echo [2/2] Dev server start ho raha hai...
echo.
echo -------------------------------------------------
echo    Link:  http://127.0.0.1:5173/
echo -------------------------------------------------
echo    NOTE: "localhost" se error aaye to 127.0.0.1 use
echo          karein - dono ka server ek hi hai.
echo    Browser apne aap khul jayega.
echo    Band karne ke liye is window me Ctrl + C dabaayein.
echo.

call npm run dev

echo.
echo -------------------------------------------------
echo    Server band ho gaya.
echo    Dobara chalane ke liye start.bat dobara
echo    double-click karein.
echo -------------------------------------------------
echo.
pause