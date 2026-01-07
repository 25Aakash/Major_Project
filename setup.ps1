# NeuroLearn Setup Script
# Run this to install all dependencies

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NeuroLearn Project Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found! Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check Python
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "$pythonVersion found" -ForegroundColor Green
} catch {
    Write-Host "Python not found! ML module will not work without Python 3.11+" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Backend Dependencies..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Set-Location -Path backend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Backend installation failed!" -ForegroundColor Red
    Set-Location -Path ..
    exit 1
}
Set-Location -Path ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Frontend Dependencies..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Set-Location -Path frontend
npm install --legacy-peer-deps
if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Frontend installation failed!" -ForegroundColor Red
    Set-Location -Path ..
    exit 1
}
Set-Location -Path ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing ML Module Dependencies..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
try {
    Set-Location -Path ml-module
    python -m pip install -r requirements.txt
    if ($LASTEXITCODE -eq 0) {
        Write-Host "ML module dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "ML module installation had issues (non-critical for demo)" -ForegroundColor Yellow
    }
    Set-Location -Path ..
} catch {
    Write-Host "Skipping ML module (Python not available)" -ForegroundColor Yellow
    Set-Location -Path ..
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "2. Start the backend: cd backend; npm run dev" -ForegroundColor White
Write-Host "3. Start the frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host "4. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see docs\DEMO_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
