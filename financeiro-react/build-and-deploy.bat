@echo off
echo ========================================
echo    BUILD E DEPLOY
echo ========================================
echo.
echo Fazendo build da aplicacao...
echo.

REM Navegar para o diretório atual
cd /d "%~dp0"

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
    echo.
)

REM Fazer build
echo Compilando aplicacao...
npm run build

if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha na compilacao!
    echo Verifique os erros acima.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    BUILD CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo Arquivos compilados estao na pasta 'dist'
echo.
echo Para fazer deploy:
echo 1. Copie o conteudo da pasta 'dist' para seu servidor web
echo 2. Ou use um servidor local como Live Server
echo.
pause
