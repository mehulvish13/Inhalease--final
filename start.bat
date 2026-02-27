@echo off
setlocal enabledelayedexpansion
echo Starting InhaleEase Application Environment...

set "ROOT=%~dp0"
set "BACKEND=%ROOT%Inhalease--master\backend"
set "FLASK=%BACKEND%\flask-app"

rem Step 1: Start Node/Express Backend (serves frontend)
echo [1/2] Starting Backend Server on port 5000...
where node >nul 2>nul
if errorlevel 1 (
	echo Node.js not found. Please install Node.js and rerun this script.
) else (
	if not exist "%BACKEND%\node_modules" (
		echo Installing backend dependencies...
		pushd "%BACKEND%"
		call npm install
		popd
	)
	start "InhaleEase API" cmd /k "cd /d %BACKEND% && npm start"
)

rem Step 2: Start Flask App (optional proxy target)
echo [2/2] Starting Flask App on port 5005...
where python >nul 2>nul
if errorlevel 1 (
	echo Python not found. Skipping Flask app.
) else (
	start "InhaleEase Flask" cmd /k "cd /d %FLASK% && python app.py"
)

echo.
echo Application successfully launched!
echo Launching your browser to http://localhost:5000
ping 127.0.0.1 -n 4 >nul
start http://localhost:5000
