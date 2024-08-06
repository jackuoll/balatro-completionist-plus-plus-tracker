#!/bin/sh

if ! command -v python3 >/dev/null 2>&1; then
    echo "Python is not installed or not in PATH. Please install Python from https://www.python.org/downloads/ and run this script again."
    exit 1
fi

if [ ! -d "venv" ]; then
    python3 -m venv venv
    . venv/bin/activate
    pip install -r requirements.txt
else
    . venv/bin/activate
fi

if lsof -i :5000; then
    echo "Port 5000 is already in use. Please close the application using this port and try again."
    exit 1
fi

flask run