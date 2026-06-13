@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Please install Node.js or add it to PATH.
  pause
  exit /b 1
)
echo Deploying Neon Case to Vercel production...
npx.cmd vercel --prod --yes
pause
