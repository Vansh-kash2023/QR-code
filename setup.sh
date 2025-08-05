#!/bin/bash

echo "🚀 Setting up QR-Enabled Faculty Availability System..."

# Install root dependencies
echo "📦 Installing server dependencies..."
npm install

# Check if client directory exists
if [ -d "client" ]; then
    echo "📱 Installing client dependencies..."
    cd client
    npm install socket.io-client axios react-router-dom qr-scanner-react
    cd ..
else
    echo "⚠️  Client directory not found. Please run 'npx create-react-app client' first."
fi

# Create database directory if it doesn't exist
mkdir -p database

echo "✅ Setup complete!"
echo ""
echo "To start the development servers:"
echo "  npm run dev"
echo ""
echo "To start individually:"
echo "  npm run server (Backend only)"
echo "  npm run client (Frontend only)"
