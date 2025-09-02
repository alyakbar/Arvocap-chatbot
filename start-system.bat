@echo off
echo 🚀 Starting ArvoCap Chatbot System...

REM Start Python training system
echo 📡 Starting Python API server...
cd python_training
if not exist env (
    python -m venv env
)
call env\Scripts\activate
pip install -r requirements.txt
start "Python API" cmd /k "python api_server.py"

echo ✅ Python API server starting...

REM Wait for Python server to initialize
echo ⏳ Waiting for Python server to initialize...
timeout /t 5 /nobreak >nul

REM Start Next.js application
echo 🌐 Starting Next.js application...
cd ..
call npm install
start "Next.js App" cmd /k "npm run dev"

echo ✅ Next.js application starting...

echo 🎉 ArvoCap Chatbot System is starting!
echo 📱 Web App: http://localhost:3000
echo 📡 Python API: http://localhost:8000
echo 📖 API Docs: http://localhost:8000/docs
echo.
echo Press any key to continue...
pause >nul
