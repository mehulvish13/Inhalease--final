@echo off
setlocal enabledelayedexpansion
title InhaleEase Development Server
cls

echo.
echo ============================================================
echo          InhaleEase - Node.js Development Server
echo ============================================================
echo.

set "ROOT=%~dp0"
set "BACKEND=%ROOT%Inhalease--master\backend"
set "ENV_FILE=%BACKEND%\.env"

rem --- Check Node.js ---
where node >nul 2>nul
if errorlevel 1 (
	echo [ERROR] Node.js not found!
	echo Install from: https://nodejs.org/
	pause
	exit /b 1
)
echo [OK] Node.js found

rem --- Check backend exists ---
if not exist "%BACKEND%\server.js" (
	echo [ERROR] Backend not found at: %BACKEND%
	pause
	exit /b 1
)
echo [OK] Backend found

rem --- Create .env if missing ---
if not exist "%ENV_FILE%" (
	if exist "%BACKEND%\.env.example" (
		copy "%BACKEND%\.env.example" "%ENV_FILE%" >nul
		echo [OK] .env created from .env.example
	) else (
		(
			echo JWT_SECRET=dev-secret-please-change-in-production-use-32-chars
			echo NODE_ENV=development
			echo PORT=5000
		) > "%ENV_FILE%"
		echo [OK] .env created with defaults
	)
) else (
	echo [OK] .env found
)

rem --- Install dependencies if missing ---
if not exist "%BACKEND%\node_modules" (
	echo [INFO] Installing npm dependencies...
	pushd "%BACKEND%"
	call npm install
	if errorlevel 1 (
		echo [ERROR] npm install failed!
		popd
		pause
		exit /b 1
	)
	popd
)
echo [OK] Dependencies ready

rem --- Kill anything already on port 5000 ---
echo [INFO] Freeing port 5000...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| find ":5000 " ^| find "LISTENING"') do (
	taskkill /F /PID %%a >nul 2>nul
)
echo [OK] Port 5000 is free

echo.
echo ============================================================
echo  Server starting at: http://localhost:5000
echo  Open browser to:    http://localhost:5000
echo  Press CTRL+C to stop the server
echo ============================================================
echo.

rem --- Start server and open browser after 2s ---
pushd "%BACKEND%"
start /B timeout /t 2 /nobreak >nul && start http://localhost:5000
npm start
popd

pause

