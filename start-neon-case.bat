@echo off
cd /d "%~dp0"
set PORT=8797
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Please install Node.js or add it to PATH.
  pause
  exit /b 1
)
echo Starting Neon Case on http://127.0.0.1:%PORT% ...
echo Keep the server window open while using the demo.
start "Neon Case Server" cmd /k "cd /d ""%~dp0"" && set PORT=%PORT% && node server.js"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"
