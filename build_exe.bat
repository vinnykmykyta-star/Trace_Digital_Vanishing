@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Встановлення залежностей (потрібен інтернет і Node.js)...
call npm install
if errorlevel 1 goto err
echo Збірка exe...
call npm run build
if errorlevel 1 goto err
echo.
echo Готово! Гра: dist\TraceDigitalVanishing-win32-x64\TraceDigitalVanishing.exe
pause
exit /b 0
:err
echo Помилка збірки. Перевірте, що встановлено Node.js (https://nodejs.org) і є інтернет.
pause
exit /b 1
