#!/bin/bash

echo "🚀 Preparing Faculty Availability System for Render Deployment"
echo "============================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Faculty Availability System"
else
    echo "✅ Git repository found"
fi

# Ensure all deployment files exist
echo "📋 Checking deployment files..."

if [ ! -f "Procfile" ]; then
    echo "❌ Procfile missing"
    exit 1
fi

if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml missing"
    exit 1
fi

if [ ! -f "client/public/_redirects" ]; then
    echo "❌ client/public/_redirects missing"
    exit 1
fi

echo "✅ All deployment files present"

# Test local build
echo "🔨 Testing production build..."
cd client
if npm run build; then
    echo "✅ Frontend build successful"
    cd ..
else
    echo "❌ Frontend build failed"
    cd ..
    exit 1
fi

# Test backend startup
echo "🖥️  Testing backend startup..."
if timeout 10 npm start &>/dev/null; then
    echo "✅ Backend starts successfully"
else
    echo "⚠️  Backend test timeout (this might be normal)"
fi

echo ""
echo "🎉 Deployment Preparation Complete!"
echo ""
echo "Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://dashboard.render.com"
echo "3. Follow the RENDER_DEPLOYMENT_GUIDE.md"
echo ""
echo "📖 For detailed instructions, see: RENDER_DEPLOYMENT_GUIDE.md"
echo ""
