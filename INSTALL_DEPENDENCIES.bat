@echo off
title Course Registration and Timetable System - Dependency Installer
echo ========================================================
echo  Installing Dependencies for Course Registration System
echo ========================================================
echo.
echo [1/2] Installing Backend Python Requirements...
cd /d %~dp0backend
py -m pip install -r requirements.txt
echo.
echo [2/2] Installing Frontend Node Modules...
cd /d %~dp0frontend
call npm install
echo.
echo Dependencies successfully installed!
echo You can now run START_APPLICATION.bat to launch the project.
pause
