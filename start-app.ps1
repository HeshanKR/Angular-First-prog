# start.app.ps1
# Launch Angular frontend and Express backend in separate PowerShell windows

# Get the root directory
$root = Get-Location

# Start Angular frontend
Write-Host "🚀 Starting Angular Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\angFrontend'; Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; ng serve"

# Start Express backend
Write-Host "🚀 Starting Express Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\express-backend'; Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; npm run dev"

Write-Host "✅ Both frontend and backend launched successfully."
