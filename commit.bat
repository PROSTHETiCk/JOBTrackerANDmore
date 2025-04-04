@echo off
REM Batch script to stage ALL changes (modified, deleted, new) and commit them.
REM WARNING: Uses 'git add .' which stages EVERYTHING in the current directory.
REM          Make sure untracked files are intended for commit or add them to .gitignore first!
REM          Run this script from the root of your Git repository.

echo ========== Current Git Status ==========
git status
echo ========================================
echo.
echo This script will stage ALL the changes listed above (modified, deleted, and NEW files).
pause REM Press any key to continue, or Ctrl+C to abort.

echo.
echo Staging all changes (git add .)...
git add .
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to stage changes. Aborting.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========== Status After Staging ==========
REM Show status again so user sees what WILL be committed
git status
echo =========================================
echo.

REM Prompt for commit message
set /p commitMessage="Enter commit message: "

REM Check if commit message is empty (basic check)
if "%commitMessage%"=="" (
    echo ERROR: Commit message cannot be empty. Aborting commit.
    echo You may need to run 'git commit' manually or re-run this script.
    pause
    exit /b 1
)

echo.
echo Committing staged changes...
git commit -m "%commitMessage%"
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to commit changes. Check Git output above.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========== Final Git Status ==========
git status
echo =====================================
echo.
echo Script finished.
pause REM Keep window open to see output
exit /b 0