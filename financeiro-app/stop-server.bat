@echo off
echo ========================================
echo    PARANDO SERVIDOR ANGULAR
echo ========================================
echo.
echo Encerrando processos do servidor...
echo.

REM Para todos os processos Node.js relacionados ao Angular
taskkill /f /im node.exe 2>nul
taskkill /f /im ng.exe 2>nul

echo.
echo Servidor parado com sucesso!
echo.
echo Pressione qualquer tecla para fechar...
pause > nul
