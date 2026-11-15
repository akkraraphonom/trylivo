@echo off
cd /d "%~dp0"
echo.
echo  TRYLIVO - http://localhost:3000
echo  Keep this window open. Ctrl+C to stop.
echo.
if not exist node_modules\lenis (
  echo Installing packages - first run only...
  call npm install
  if errorlevel 1 ( echo. & echo npm install failed. & pause & exit /b 1 )
)
npm run dev
pause
