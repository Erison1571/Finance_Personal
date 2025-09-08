@echo off
echo ========================================
echo    PARANDO SERVIDOR
echo ========================================
echo.
echo Parando servidor React...
echo.

REM Parar processos do Node.js na porta 5174
for /f "tokens=5" %%a in ('netstat -aon ^| find "5174"') do (
    echo Parando processo %%a...
    taskkill /f /pid %%a >nul 2>&1
)

REM Parar processos do Node.js na porta 5173 (caso esteja rodando na porta antiga)
for /f "tokens=5" %%a in ('netstat -aon ^| find "5173"') do (
    echo Parando processo %%a...
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo Servidor parado com sucesso!
echo.
pause
