@echo off
title Controle Financeiro Pessoal
color 0A

:menu
cls
echo ========================================
echo    CONTROLE FINANCEIRO PESSOAL
echo ========================================
echo.
echo Escolha uma opcao:
echo.
echo 1. Iniciar Servidor de Desenvolvimento
echo 2. Parar Servidor
echo 3. Fazer Build da Aplicacao
echo 4. Instalar Dependencias
echo 5. Abrir Pasta do Projeto
echo 6. Sair
echo.
echo ========================================
set /p choice="Digite sua opcao (1-6): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto build
if "%choice%"=="4" goto install
if "%choice%"=="5" goto open
if "%choice%"=="6" goto exit
goto menu

:start
cls
echo Iniciando servidor...
call start-server.bat
goto menu

:stop
cls
echo Parando servidor...
call stop-server.bat
goto menu

:build
cls
echo Fazendo build...
call build-and-deploy.bat
goto menu

:install
cls
echo Instalando dependencias...
cd /d "%~dp0"
npm install
echo.
echo Dependencias instaladas!
pause
goto menu

:open
cls
echo Abrindo pasta do projeto...
explorer .
goto menu

:exit
cls
echo Obrigado por usar o Controle Financeiro Pessoal!
echo.
pause
exit
