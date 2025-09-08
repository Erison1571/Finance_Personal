@echo off
echo ========================================
echo    DIAGNOSTICO - CONTROLE FINANCEIRO
echo ========================================
echo.

REM Navegar para o diretório atual
cd /d "%~dp0"

echo 1. Verificando estrutura do projeto...
if exist "package.json" (
    echo    ✓ package.json encontrado
) else (
    echo    ✗ package.json NAO encontrado
    goto error
)

if exist "src\main.tsx" (
    echo    ✓ main.tsx encontrado
) else (
    echo    ✗ main.tsx NAO encontrado
    goto error
)

if exist "src\App.tsx" (
    echo    ✓ App.tsx encontrado
) else (
    echo    ✗ App.tsx NAO encontrado
    goto error
)

echo.
echo 2. Verificando dependencias...
if exist "node_modules" (
    echo    ✓ node_modules encontrado
) else (
    echo    ✗ node_modules NAO encontrado
    echo    Instalando dependencias...
    npm install
    if %errorlevel% neq 0 (
        echo    ✗ Erro ao instalar dependencias
        goto error
    )
)

echo.
echo 3. Testando compilacao...
echo    Compilando aplicacao...
npm run build
if %errorlevel% neq 0 (
    echo    ✗ Erro na compilacao
    goto error
) else (
    echo    ✓ Compilacao bem-sucedida
)

echo.
echo 4. Iniciando servidor de teste...
echo    Abrindo teste.html no navegador...
start teste.html

echo.
echo 5. Iniciando servidor React...
echo    Acesse: http://localhost:5174
echo    Pressione Ctrl+C para parar
echo.
npm run dev

goto end

:error
echo.
echo ========================================
echo    ERRO ENCONTRADO!
echo ========================================
echo.
echo Verifique os erros acima e tente novamente.
echo.
pause
exit /b 1

:end
echo.
echo ========================================
echo    DIAGNOSTICO CONCLUIDO
echo ========================================
echo.
pause
