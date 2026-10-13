@echo off
title Course Registration and Timetable System - Launcher
echo ========================================================
echo  COURSE REGISTRATION & TIMETABLE SYSTEM
echo  ONE SYSTEM. COMPLETE ACADEMIC REGISTRATION.
echo ========================================================
echo.
echo [1/2] Starting Flask Backend Server (Port 5005)...
start "Backend API Server" cmd /k "cd /d %~dp0backend & py run.py"

echo [2/2] Starting React Vite Frontend Server (Port 3000)...
start "Frontend Web Server" cmd /k "cd /d %~dp0frontend & npm run dev"

echo.
echo Waiting 4 seconds for services to initialize...
timeout /t 4 /nobreak >nul

echo.
echo Opening Application in default browser...
start http://localhost:3000
echo.
echo Application is running!
echo - Frontend: http://localhost:3000
echo - Backend:  http://127.0.0.1:5005
echo.
pause
