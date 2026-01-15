#!/usr/bin/env pwsh
# NeuroLearn AI-Adaptive Platform - Startup Script
# Run this to start all services at once

Write-Host "🚀 Starting NeuroLearn Platform..." -ForegroundColor Cyan
Write-Host ""

# Function to start service in new window
function Start-Service {
    param($Name, $Path, $Command)
    Write-Host "▶️  Starting $Name..." -ForegroundColor Green
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$Path'; $Command"
    Start-Sleep -Seconds 2
}

# Get project root
$ProjectRoot = $PSScriptRoot

Write-Host "📁 Project Root: $ProjectRoot" -ForegroundColor Yellow
Write-Host ""

# Check if MongoDB is running
Write-Host "🔍 Checking MongoDB..." -ForegroundColor Cyan
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongoRunning) {
    Write-Host "⚠️  MongoDB not detected. Starting MongoDB..." -ForegroundColor Yellow
    Write-Host "   If this fails, start MongoDB manually: mongod" -ForegroundColor Gray
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "mongod"
    Start-Sleep -Seconds 3
} else {
    Write-Host "✅ MongoDB already running" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Starting Services..." -ForegroundColor Cyan
Write-Host ""

# Start Backend (Node.js)
Start-Service -Name "Backend Server" -Path "$ProjectRoot\backend" -Command "npm run dev"

# Start ML API (Python)
Start-Service -Name "ML API" -Path "$ProjectRoot\ml-module" -Command "python ml_api.py"

# Start Frontend (React)
Start-Service -Name "Frontend" -Path "$ProjectRoot\frontend" -Command "npm run dev"

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Service URLs:" -ForegroundColor Cyan
Write-Host "   🌐 Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   🔧 Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "   🤖 ML API:    http://localhost:5001" -ForegroundColor White
Write-Host "   🗄️  MongoDB:   mongodb://localhost:27017" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Wait 10 seconds for all services to fully start" -ForegroundColor Yellow
Write-Host "💡 Then open: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "🛑 To stop all services: Close all PowerShell windows" -ForegroundColor Red
Write-Host ""

# Wait and open browser
Write-Host "⏳ Waiting 10 seconds for services to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host "🌐 Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✨ NeuroLearn is ready!" -ForegroundColor Cyan
Write-Host "   Press any key to exit this window (services will keep running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
