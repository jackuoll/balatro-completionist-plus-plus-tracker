@echo off
setlocal

where python3 >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Python is not installed or not in PATH. Please install Python from https://www.python.org/downloads/ and run this script again.
    exit /b 1
)

if not exist "venv\Scripts\activate.bat" (
    python3 -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

netstat -an | findstr :5000 >nul
if %ERRORLEVEL% equ 0 (
    echo Port 5000 is already in use. Please close the application using this port and try again.
    exit /b 1
)

flask run