@echo off
echo ========================================
echo    CONTROLE FINANCEIRO - SPRINT 6
echo ========================================
echo.
echo Iniciando servidor Angular na porta 5173...
echo.
echo Aguarde alguns segundos para o servidor inicializar...
echo.

REM Inicia o servidor Angular em background
start /B npm start

REM Aguarda 10 segundos para o servidor inicializar
timeout /t 10 /nobreak > nul

REM Abre o navegador padrão
echo Abrindo navegador...
start http://localhost:5173

echo.
echo ========================================
echo Servidor iniciado com sucesso!
echo.
echo URL: http://localhost:5173
echo Porta: 5173
echo.
echo Para parar o servidor, feche esta janela
echo ou pressione Ctrl+C no terminal
echo ========================================
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul
