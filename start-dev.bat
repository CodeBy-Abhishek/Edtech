@echo off
echo ===================================================
echo   Staring AI Edtech Platform (Local Dev)
echo ===================================================

echo [1/2] Starting Backend Server...
start "AI Edtech Backend" /D "backend" npm run dev

echo [2/2] Starting Frontend Server...
start "AI Edtech Frontend" /D "frontend" npm run dev

echo.
echo ===================================================
echo   Servers are starting in new windows.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ===================================================
echo.
echo NOTE: If you just added CAPTCHA keys, they will be loaded now.
echo.
pause
