@echo off
echo.
echo ========================================
echo   Faculty Availability System Setup
echo ========================================
echo.

echo [1/6] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Server dependency installation failed!
    pause
    exit /b 1
)
echo ✅ Server dependencies installed successfully!
echo.

echo [2/6] Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Client dependency installation failed!
    pause
    exit /b 1
)
echo ✅ Client dependencies installed successfully!
echo.

echo [3/6] Setting up database...
cd ..\server
call node -e "const db = require('./models/database'); console.log('Database initialized successfully!');"
if %errorlevel% neq 0 (
    echo ❌ Database setup failed!
    pause
    exit /b 1
)
echo ✅ Database initialized successfully!
echo.

echo [4/6] Seeding database with sample data...
call node seed.js
if %errorlevel% neq 0 (
    echo ❌ Database seeding failed!
    pause
    exit /b 1
)
echo ✅ Database seeded successfully!
echo.

echo [5/6] Building React application...
cd ..\client
call npm run build
if %errorlevel% neq 0 (
    echo ⚠️  Build failed, but you can still run in development mode
)
echo.

echo [6/6] Setup complete!
echo.
echo ========================================
echo   🎉 Setup Completed Successfully!
echo ========================================
echo.
echo Your Faculty Availability System is ready!
echo.
echo To start the application:
echo.
echo   1. Start the server:
echo      cd server
echo      npm start
echo.
echo   2. In a new terminal, start the client:
echo      cd client  
echo      npm start
echo.
echo Then open: http://localhost:3000
echo.
echo Default login credentials:
echo   Email: sarah.johnson@university.edu
echo   Password: password123
echo.
echo ========================================
pause
