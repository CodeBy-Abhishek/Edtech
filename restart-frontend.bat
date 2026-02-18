@echo off
echo ===================================================
echo   RESTARTING FRONTEND ONLY
echo ===================================================

echo [1/2] Stopping existing Frontend process...
taskkill /F /FI "WINDOWTITLE eq AI Edtech Frontend*" >nul 2>&1
echo Done.

echo [2/2] Starting Frontend Server...
start "AI Edtech Frontend" /D "frontend" npm run dev

echo.
echo ===================================================
echo   FRONTEND RESTARTING...
echo ===================================================
echo.
pause
