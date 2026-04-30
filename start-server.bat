@echo off
title Makimoo Local Server (Port 8080)
echo ============================================
echo   Makimoo Local Web Server
echo   http://localhost:8080
echo   Press Ctrl+C to stop
echo ============================================
echo.
cd /d "E:\Makimoo Website\headless-store\dist"
"C:\Users\12021\.workbuddy\binaries\python\versions\3.13.12\python.exe" -m http.server 8080
pause
