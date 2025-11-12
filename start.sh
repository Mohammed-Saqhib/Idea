#!/bin/bash

# FinLearn Pro Startup Script

echo "🚀 Starting FinLearn Pro..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Install backend dependencies if needed
if [ ! -d "backend/__pycache__" ] && [ ! -f "backend/.installed" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    pip install -r requirements.txt
    touch .installed
    cd ..
fi

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start backend in background
echo "🔧 Starting backend server on port 5000..."
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server on port 3000..."
echo ""
echo "✅ FinLearn Pro is starting!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Trap Ctrl+C and kill both processes
trap "kill $BACKEND_PID 2>/dev/null; exit" INT TERM

npm run dev

# Cleanup on exit
kill $BACKEND_PID 2>/dev/null

