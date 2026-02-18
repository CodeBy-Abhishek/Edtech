@echo off
echo ===================================================
echo   FIXING AND RESTARTING EDTECH PLATFORM
echo ===================================================

echo [1/3] Stopping existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
echo Done.

echo [2/3] Starting Backend Server...
start "AI Edtech Backend" /D "backend" npm run dev

echo [3/3] Starting Frontend Server...
start "AI Edtech Frontend" /D "frontend" npm run dev

echo.
echo ===================================================
echo   SERVERS RESTARTED
echo   Please wait 10-15 seconds for them to boot up.
echo   Then try logging in again.
echo ===================================================
echo.
pause
