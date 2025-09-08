@echo off
echo ========================================
echo    CONTROLE FINANCEIRO PESSOAL
echo ========================================
echo.
echo Iniciando servidor React...
echo.
echo Aguarde a compilacao terminar e depois acesse:
echo http://localhost:5173
echo.
echo IMPORTANTE: Use a porta 5173 (configurada no vite.config.ts)
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

REM Navegar para o diretório atual
cd /d "%~dp0"

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
    echo.
)

REM Iniciar servidor
npm run dev

echo.
echo Servidor finalizado.
pause
