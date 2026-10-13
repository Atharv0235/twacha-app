# Twacha Backend Server Startup Script
Write-Host "Starting Twacha backend on http://0.0.0.0:8000..." -ForegroundColor Green
uvicorn app.main:app --host 0.0.0.0 --port 8000
