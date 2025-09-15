#!/bin/bash

echo "🚀 Starting Saasan Development Environment..."

# Function to open browser after delay
open_browsers() {
    echo "⏳ Waiting for servers to start..."
    sleep 10
    
    echo "🌐 Opening React Native app in browser..."
    xdg-open http://localhost:8082 &
    
    sleep 2
    
    echo "🌐 Opening React Dashboard in browser..."
    xdg-open http://localhost:5173 &
    
    echo "✅ Both apps should now be open in your browser!"
    echo "📱 React Native: http://localhost:8082"
    echo "💻 React Dashboard: http://localhost:5173"
    echo "🔧 Backend API: http://localhost:5000"
}

# Start the development servers
echo "🔧 Starting backend server..."
cd saasan-node-be && npm run dev &
BACKEND_PID=$!

echo "📱 Starting React Native app..."
cd ../saasan-mobile-rn && npm run dev:web &
MOBILE_PID=$!

echo "💻 Starting React Dashboard..."
cd ../saasan-dashboard-react && npm run dev &
DASHBOARD_PID=$!

# Open browsers after delay
open_browsers &

# Wait for user to stop
echo "Press Ctrl+C to stop all servers"
wait
