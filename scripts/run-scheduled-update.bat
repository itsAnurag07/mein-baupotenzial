@echo off
cd /d "%~dp0\.."
"C:\Program Files\nodejs\node.exe" scripts\send-scheduled-update.mjs >> scripts\cron.log 2>&1
