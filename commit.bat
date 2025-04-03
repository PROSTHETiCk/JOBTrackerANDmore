@echo off
echo ================================================
echo  Sentrie.job Git Sync Script
echo ================================================
echo.

REM Ensure we are in the correct directory (where the script lives)
cd /d "%~dp0"

REM Check if it's a git repository
IF NOT EXIST ".git" (
    echo [ERROR] This does not appear to be a Git repository. (.git folder not found)
    goto End
)

echo [INFO] Staging all changes (git add .)...
git add .
echo.

REM Check if there are changes to commit
git diff --staged --quiet
IF ERRORLEVEL 1 (
    echo [INFO] Creating automated commit...
    REM Using a generic commit message with date and time
    git commit -m "Automated commit by script [%date% %time%]"
    echo.

    echo [INFO] Pushing changes to GitHub (origin main)...
    git push origin main
    IF ERRORLEVEL 1 (
        echo [ERROR] 'git push' failed. Check connection or authentication.
    ) ELSE (
        echo [SUCCESS] Changes pushed successfully.
    )
) ELSE (
    echo [INFO] No changes staged to commit. Working tree clean?
)

echo.
echo ================================================
echo  Sync script finished.
echo ================================================
echo.

:End
pause
exit /b