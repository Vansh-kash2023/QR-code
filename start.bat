@echo off
echo.
echo ========================================
echo   Quick Start - Faculty Availability System
echo ========================================
echo.

echo Starting the Faculty Availability System...
echo.

echo [1/2] Starting backend server...
start "Faculty Backend Server" cmd /k "cd /d \"%~dp0server\" && npm start"

timeout /t 3 /nobreak > nul

echo [2/2] Starting frontend application...
start "Faculty Frontend App" cmd /k "cd /d \"%~dp0client\" && npm start"

echo.
echo ✅ Both servers are starting up!
echo.
echo The application will be available at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo Default login credentials:
echo   Email: sarah.johnson@university.edu
echo   Password: password123
echo.
echo Press any key to close this window...
pause > nul
