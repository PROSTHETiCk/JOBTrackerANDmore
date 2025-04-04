@echo off
setlocal enabledelayedexpansion

REM --- Configuration ---
set FRONTEND_URL=http://localhost:5173
REM Set default flags to false
set INSTALL_DEPS=false
set MIGRATE_DB=false
set OPEN_BROWSER=false

REM --- Argument Parsing ---
:argloop
if "%1"=="" goto :argsdone
if /i "%1"=="--install" set INSTALL_DEPS=true & shift & goto :argloop
if /i "%1"=="--migrate" set MIGRATE_DB=true & shift & goto :argloop
if /i "%1"=="--open" set OPEN_BROWSER=true & shift & goto :argloop
echo [WARN] Unknown argument: %1
shift
goto :argloop
:argsdone

echo Starting Sentrie.job Development Environment...
echo Install Dependencies: %INSTALL_DEPS%
echo Run Migrations: %MIGRATE_DB%
echo Open Browser: %OPEN_BROWSER%
echo ---

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0
set BACKEND_DIR=%SCRIPT_DIR%backend
set FRONTEND_DIR=%SCRIPT_DIR%frontend
set VENV_ACTIVATE=%BACKEND_DIR%\venv\Scripts\activate.bat

REM --- Pre-checks ---
REM Check if backend venv activation script exists
if not exist "%VENV_ACTIVATE%" (
    echo [ERROR] Backend venv activation script not found at: %VENV_ACTIVATE%
    goto :error_exit
)
REM Check if frontend package.json exists
if not exist "%FRONTEND_DIR%\package.json" (
    echo [ERROR] Frontend package.json not found in: %FRONTEND_DIR%
    goto :error_exit
)

REM --- Optional Installs ---
if "%INSTALL_DEPS%"=="true" (
    echo [INFO] Attempting dependency installation...

    echo [INFO] Installing backend dependencies...
    call "%VENV_ACTIVATE%" && (
        pip install -r "%BACKEND_DIR%\requirements.txt"
        if !errorlevel! neq 0 (
            echo [ERROR] Backend pip install failed.
            goto :error_exit
        )
    ) || (
      echo [ERROR] Failed to activate backend venv for install.
      goto :error_exit
    )

    echo [INFO] Installing frontend dependencies...
    cd /d "%FRONTEND_DIR%"
    npm install
    if !errorlevel! neq 0 (
        echo [ERROR] Frontend npm install failed.
        goto :error_exit
    )
    cd /d "%SCRIPT_DIR%"
    echo [INFO] Dependency installation finished.
    echo ---
)

REM --- Optional Database Migration ---
if "%MIGRATE_DB%"=="true" (
    echo [INFO] Attempting database migration...
    call "%VENV_ACTIVATE%" && (
        echo Activating venv for migration...
        cd /d "%BACKEND_DIR%"
        flask db upgrade
        if !errorlevel! neq 0 (
            echo [ERROR] 'flask db upgrade' command failed.
            cd /d "%SCRIPT_DIR%"
            goto :error_exit
        )
        cd /d "%SCRIPT_DIR%"
    ) || (
      echo [ERROR] Failed to activate backend venv for migration.
      goto :error_exit
    )
    echo [INFO] Database migration attempt finished.
    echo ---
)

REM --- Start Backend Server ---
echo [INFO] Starting Backend Server in a new window...
set BACKEND_CMD=cd /d "%BACKEND_DIR%" ^&^ call "%VENV_ACTIVATE%" ^&^ echo Backend venv activated. Starting Flask... ^&^ flask run
start "Sentrie Backend" cmd /k "%BACKEND_CMD%"

REM --- Start Frontend Server ---
echo [INFO] Starting Frontend Server in a new window...
set FRONTEND_CMD=cd /d "%FRONTEND_DIR%" ^&^ echo Starting Vite dev server... ^&^ npm run dev
start "Sentrie Frontend" cmd /k "%FRONTEND_CMD%"

REM --- Optional Open Browser ---
if "%OPEN_BROWSER%"=="true" (
    echo [INFO] Waiting a few seconds before opening browser...
    timeout /t 5 /nobreak > nul
    echo [INFO] Opening %FRONTEND_URL% in default browser...
    start "" "%FRONTEND_URL%"
)

echo [SUCCESS] Both server processes initiated in separate windows.
goto :eof

:error_exit
echo [FAILED] Script encountered an error during setup/optional steps. Please check messages above.
pause
:eof
echo Script finished.