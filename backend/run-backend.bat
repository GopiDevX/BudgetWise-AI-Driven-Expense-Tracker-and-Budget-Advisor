@echo off
cd /d "%~dp0"
echo Starting BudgetWise Backend...
mvn spring-boot:run -ntp
pause
