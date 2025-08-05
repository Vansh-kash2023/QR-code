@echo off
echo.
echo 🚀 Preparing Faculty Availability System for Render Deployment
echo ============================================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

echo ✅ Project structure verified
echo.

REM Check deployment files
echo 📋 Checking deployment files...

if not exist "Procfile" (
    echo ❌ Procfile missing
    pause
    exit /b 1
)

if not exist "render.yaml" (
    echo ❌ render.yaml missing  
    pause
    exit /b 1
)

if not exist "client\public\_redirects" (
    echo ❌ client\public\_redirects missing
    pause
    exit /b 1
)

echo ✅ All deployment files present
echo.

REM Test local build
echo 🔨 Testing production build...
cd client
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    cd ..
    pause
    exit /b 1
)

echo ✅ Frontend build successful
cd ..
echo.

echo 🎉 Deployment Preparation Complete!
echo.
echo Next Steps:
echo 1. Push your code to GitHub:
echo    git add .
echo    git commit -m "Ready for Render deployment"
echo    git push origin main
echo.
echo 2. Go to https://dashboard.render.com
echo 3. Follow the RENDER_DEPLOYMENT_GUIDE.md
echo.
echo 📖 For detailed instructions, see: RENDER_DEPLOYMENT_GUIDE.md
echo.
pause
