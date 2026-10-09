@echo off
echo ====================================================
echo Starting Portfolio PHP Server at http://localhost:8000
echo ====================================================
echo.
echo Press Ctrl+C in this window anytime to stop the server.
echo.
start http://localhost:8000
php -S localhost:8000
pause
