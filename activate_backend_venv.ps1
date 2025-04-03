# PowerShell Script to Open a NEW Terminal with the Backend Venv Activated

# Get the directory where this script is located
$ScriptPath = $PSScriptRoot # Assumes script is saved in project root

# Construct paths relative to the script location
$backendDir = Join-Path $ScriptPath "backend"
$venvActivationScript = Join-Path $backendDir "venv\Scripts\activate.ps1" # Using .ps1 for PowerShell

# Check if backend and activation script exist
if (-not (Test-Path -Path $backendDir -PathType Container)) {
    Write-Error "[ERROR] Backend directory not found at '$backendDir'. Cannot activate venv."
    pause
    exit 1
}
if (-not (Test-Path -Path $venvActivationScript -PathType Leaf)) {
    Write-Error "[ERROR] Activation script not found at '$venvActivationScript'."
    Write-Error "       Did you create the virtual environment using 'python -m venv venv' inside '$backendDir'?"
    pause
    exit 1
}

# --- Open NEW PowerShell Window with venv activated ---
Write-Host "[INFO] Opening new PowerShell window and activating backend venv..."
Write-Host "[INFO] Activation Script Path: $venvActivationScript"

# Command to execute in the new window: cd to backend, then activate
# Using Import-Module might be more robust for .ps1 activation within the new session
$commandToRun = "cd '$backendDir'; Import-Module '$venvActivationScript'; Write-Host 'Backend venv activated in this new window.'"

# Start a new PowerShell process. -NoExit keeps the window open after activation.
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $commandToRun

Write-Host "[SUCCESS] New activated PowerShell window should be open."
# Optional: Pause this script window briefly
# Start-Sleep -Seconds 3