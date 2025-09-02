#!/bin/bash

echo "🚀 Starting ArvoCap Chatbot System..."

# Start Python training system
echo "📡 Starting Python API server..."
cd python_training
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
python api_server.py &

PYTHON_PID=$!
echo "✅ Python API server started (PID: $PYTHON_PID)"

# Wait for Python server to be ready
echo "⏳ Waiting for Python server to initialize..."
sleep 5

# Start Next.js application
echo "🌐 Starting Next.js application..."
cd ..
npm install
npm run dev &

NEXTJS_PID=$!
echo "✅ Next.js application started (PID: $NEXTJS_PID)"

echo "🎉 ArvoCap Chatbot System is running!"
echo "📱 Web App: http://localhost:3000"
echo "📡 Python API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down ArvoCap Chatbot System..."
    kill $PYTHON_PID 2>/dev/null
    kill $NEXTJS_PID 2>/dev/null
    echo "✅ Shutdown complete"
    exit 0
}

# Register cleanup function
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
