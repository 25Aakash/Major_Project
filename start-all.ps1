# NeuroLearn - Complete Startup Script
# Run this script to start all services

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "    🧠 NeuroLearn - Starting All Services" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "📊 Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB not detected. Please start MongoDB manually" -ForegroundColor Yellow
    Write-Host "  Run: net start MongoDB" -ForegroundColor Gray
}

Write-Host ""

# Start Backend
Write-Host "🚀 Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 3

# Start ML API
Write-Host "🤖 Starting ML API Service (Port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ml-module'; Write-Host '🧠 ML API Starting...' -ForegroundColor Magenta; python ml_api.py"

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "⚛️  Starting Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '💻 Frontend Starting...' -ForegroundColor Blue; npm run dev"

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "✅ All Services Started Successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Access Points:" -ForegroundColor White
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend:   http://localhost:5000" -ForegroundColor Cyan
Write-Host "   ML API:    http://localhost:5001" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Quick Access URLs:" -ForegroundColor White
Write-Host "   Home:      http://localhost:3000/" -ForegroundColor Gray
Write-Host "   Login:     http://localhost:3000/login" -ForegroundColor Gray
Write-Host "   Register:  http://localhost:3000/register" -ForegroundColor Gray
Write-Host "   Dashboard: http://localhost:3000/dashboard" -ForegroundColor Gray
Write-Host "   Learning:  http://localhost:3000/learning" -ForegroundColor Gray
Write-Host "   Admin:     http://localhost:3000/admin" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Demo Credentials:" -ForegroundColor White
Write-Host "   Email:    demo@neurolearn.com" -ForegroundColor Gray
Write-Host "   Password: demo123" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   - Wait for all services to fully start (30-60 seconds)" -ForegroundColor Gray
Write-Host "   - Check each terminal window for status" -ForegroundColor Gray
Write-Host "   - Press Ctrl+C in each window to stop services" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to open the application in your browser..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "🎉 Application opened in browser!" -ForegroundColor Green
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
