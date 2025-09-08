@echo off
echo ========================================
echo    BACKUP COMPLETO - CONTROLE FINANCEIRO
echo ========================================
echo.

REM Navegar para o diretório do projeto
cd /d "%~dp0"

REM Criar pasta de backup com timestamp
set timestamp=%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
set backup_folder=backup_controle_financeiro_%timestamp%

echo Criando pasta de backup: %backup_folder%
mkdir "%backup_folder%" 2>nul

echo.
echo ========================================
echo    COPIANDO ARQUIVOS DO PROJETO
echo ========================================

REM Copiar todos os arquivos do projeto (exceto node_modules e dist)
echo Copiando arquivos do projeto...
xcopy /E /I /H /Y /EXCLUDE:exclude_list.txt . "%backup_folder%\projeto" >nul 2>&1

REM Criar arquivo de exclusão temporário
echo node_modules > exclude_list.txt
echo dist >> exclude_list.txt
echo .git >> exclude_list.txt
echo backup_* >> exclude_list.txt
echo *.log >> exclude_list.txt

echo.
echo ========================================
echo    CRIANDO BACKUP DOS DADOS
echo ========================================

REM Criar arquivo HTML para extrair dados do localStorage
echo Criando script de extração de dados...
echo ^<!DOCTYPE html^> > "%backup_folder%\extrair-dados.html"
echo ^<html^> >> "%backup_folder%\extrair-dados.html"
echo ^<head^> >> "%backup_folder%\extrair-dados.html"
echo     ^<title^>Extrair Dados - Controle Financeiro^</title^> >> "%backup_folder%\extrair-dados.html"
echo     ^<style^> >> "%backup_folder%\extrair-dados.html"
echo         body { font-family: Arial, sans-serif; padding: 20px; } >> "%backup_folder%\extrair-dados.html"
echo         .container { max-width: 800px; margin: 0 auto; } >> "%backup_folder%\extrair-dados.html"
echo         button { background: #1976d2; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px; } >> "%backup_folder%\extrair-dados.html"
echo         button:hover { background: #1565c0; } >> "%backup_folder%\extrair-dados.html"
echo         pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; } >> "%backup_folder%\extrair-dados.html"
echo     ^</style^> >> "%backup_folder%\extrair-dados.html"
echo ^</head^> >> "%backup_folder%\extrair-dados.html"
echo ^<body^> >> "%backup_folder%\extrair-dados.html"
echo     ^<div class="container"^> >> "%backup_folder%\extrair-dados.html"
echo         ^<h1^>🔍 Extrair Dados do Controle Financeiro^</h1^> >> "%backup_folder%\extrair-dados.html"
echo         ^<p^>Este arquivo extrai todos os dados salvos no localStorage do navegador.^</p^> >> "%backup_folder%\extrair-dados.html"
echo         ^<button onclick="extrairDados()"^>📤 Extrair Dados^</button^> >> "%backup_folder%\extrair-dados.html"
echo         ^<button onclick="limparDados()"^>🗑️ Limpar Dados^</button^> >> "%backup_folder%\extrair-dados.html"
echo         ^<div id="resultado"^>^</div^> >> "%backup_folder%\extrair-dados.html"
echo     ^</div^> >> "%backup_folder%\extrair-dados.html"
echo     ^<script^> >> "%backup_folder%\extrair-dados.html"
echo         function extrairDados() { >> "%backup_folder%\extrair-dados.html"
echo             const categories = JSON.parse(localStorage.getItem('categories') || '[]'); >> "%backup_folder%\extrair-dados.html"
echo             const types = JSON.parse(localStorage.getItem('types') || '[]'); >> "%backup_folder%\extrair-dados.html"
echo             const expenses = JSON.parse(localStorage.getItem('expenses') || '[]'); >> "%backup_folder%\extrair-dados.html"
echo             const incomes = JSON.parse(localStorage.getItem('incomes') || '[]'); >> "%backup_folder%\extrair-dados.html"
echo. >> "%backup_folder%\extrair-dados.html"
echo             const allData = { >> "%backup_folder%\extrair-dados.html"
echo                 categories, >> "%backup_folder%\extrair-dados.html"
echo                 types, >> "%backup_folder%\extrair-dados.html"
echo                 expenses, >> "%backup_folder%\extrair-dados.html"
echo                 incomes, >> "%backup_folder%\extrair-dados.html"
echo                 timestamp: new Date().toISOString(), >> "%backup_folder%\extrair-dados.html"
echo                 version: '1.0.0' >> "%backup_folder%\extrair-dados.html"
echo             }; >> "%backup_folder%\extrair-dados.html"
echo. >> "%backup_folder%\extrair-dados.html"
echo             const dataStr = JSON.stringify(allData, null, 2); >> "%backup_folder%\extrair-dados.html"
echo             document.getElementById('resultado').innerHTML = '^<h3^>Dados Extraídos:^</h3^>^<pre^>' + dataStr + '^</pre^>'; >> "%backup_folder%\extrair-dados.html"
echo. >> "%backup_folder%\extrair-dados.html"
echo             const dataBlob = new Blob([dataStr], {type: 'application/json'}); >> "%backup_folder%\extrair-dados.html"
echo             const url = URL.createObjectURL(dataBlob); >> "%backup_folder%\extrair-dados.html"
echo             const link = document.createElement('a'); >> "%backup_folder%\extrair-dados.html"
echo             link.href = url; >> "%backup_folder%\extrair-dados.html"
echo             link.download = 'controle-financeiro-dados-' + new Date().toISOString().split('T')[0] + '.json'; >> "%backup_folder%\extrair-dados.html"
echo             link.click(); >> "%backup_folder%\extrair-dados.html"
echo             URL.revokeObjectURL(url); >> "%backup_folder%\extrair-dados.html"
echo         } >> "%backup_folder%\extrair-dados.html"
echo. >> "%backup_folder%\extrair-dados.html"
echo         function limparDados() { >> "%backup_folder%\extrair-dados.html"
echo             if (confirm('Tem certeza que deseja limpar todos os dados?')) { >> "%backup_folder%\extrair-dados.html"
echo                 localStorage.removeItem('categories'); >> "%backup_folder%\extrair-dados.html"
echo                 localStorage.removeItem('types'); >> "%backup_folder%\extrair-dados.html"
echo                 localStorage.removeItem('expenses'); >> "%backup_folder%\extrair-dados.html"
echo                 localStorage.removeItem('incomes'); >> "%backup_folder%\extrair-dados.html"
echo                 alert('Dados limpos!'); >> "%backup_folder%\extrair-dados.html"
echo             } >> "%backup_folder%\extrair-dados.html"
echo         } >> "%backup_folder%\extrair-dados.html"
echo     ^</script^> >> "%backup_folder%\extrair-dados.html"
echo ^</body^> >> "%backup_folder%\extrair-dados.html"
echo ^</html^> >> "%backup_folder%\extrair-dados.html"

echo.
echo ========================================
echo    CRIANDO DOCUMENTAÇÃO
echo ========================================

REM Criar arquivo README do backup
echo Criando documentação do backup...
echo # BACKUP COMPLETO - CONTROLE FINANCEIRO PESSOAL > "%backup_folder%\README_BACKUP.md"
echo. >> "%backup_folder%\README_BACKUP.md"
echo **Data do Backup:** %date% %time% >> "%backup_folder%\README_BACKUP.md"
echo. >> "%backup_folder%\README_BACKUP.md"
echo ## 📁 Estrutura do Backup >> "%backup_folder%\README_BACKUP.md"
echo. >> "%backup_folder%\README_BACKUP.md"
echo - **projeto/** - Código fonte completo do sistema >> "%backup_folder%\README_BACKUP.md"
echo - **extrair-dados.html** - Script para extrair dados do localStorage >> "%backup_folder%\README_BACKUP.md"
echo - **README_BACKUP.md** - Esta documentação >> "%backup_folder%\README_BACKUP.md"
echo. >> "%backup_folder%\README_BACKUP.md"
echo ## 🚀 Como Restaurar o Sistema >> "%backup_folder%\README_BACKUP.md"
echo. >> "%backup_folder%\README_BACKUP.md"
echo 1. Copie a pasta **projeto** para o local desejado >> "%backup_folder%\README_BACKUP.md"
echo 2. Execute `npm install` na pasta do projeto >> "%backup_folder%\README_BACKUP.md"
echo 3. Execute `npm run dev` para iniciar o servidor >> "%backup_folder%\README_BACKUP.md"
echo 4. Acesse `http://localhost:5173` >> "%backup_folder%\README_BACKUP.md"
echo. >> "%backup_folder%\README_BACKUP.md"
echo ## 📊 Como Restaurar os Dados >> "%backup_folder%\README_BACKUP.md"
echo. >> "%backup_folder%\README_BACKUP.md"
echo 1. Abra o arquivo **extrair-dados.html** no navegador >> "%backup_folder%\README_BACKUP.md"
echo 2. Clique em "Extrair Dados" para baixar os dados >> "%backup_folder%\README_BACKUP.md"
echo 3. Use o sistema normalmente - os dados serão carregados automaticamente >> "%backup_folder%\README_BACKUP.md"
echo. >> "%backup_folder%\README_BACKUP.md"
echo ## ⚠️ Importante >> "%backup_folder%\README_BACKUP.md"
echo. >> "%backup_folder%\README_BACKUP.md"
echo - Este backup contém o código fonte completo >> "%backup_folder%\README_BACKUP.md"
echo - Os dados são extraídos do localStorage do navegador >> "%backup_folder%\README_BACKUP.md"
echo - Mantenha este backup em local seguro >> "%backup_folder%\README_BACKUP.md"
echo. >> "%backup_folder%\README_BACKUP.md"
echo --- >> "%backup_folder%\README_BACKUP.md"
echo **Sistema:** Controle Financeiro Pessoal >> "%backup_folder%\README_BACKUP.md"
echo **Versão:** 1.0.0 >> "%backup_folder%\README_BACKUP.md"
echo **Tecnologia:** React + TypeScript + Material-UI >> "%backup_folder%\README_BACKUP.md"

echo.
echo ========================================
echo    COMPRIMINDO BACKUP
echo ========================================

REM Comprimir o backup em ZIP
echo Comprimindo backup...
powershell -command "Compress-Archive -Path '%backup_folder%' -DestinationPath '%backup_folder%.zip' -Force" >nul 2>&1

REM Remover pasta temporária
rmdir /s /q "%backup_folder%" >nul 2>&1

REM Remover arquivo de exclusão temporário
del exclude_list.txt >nul 2>&1

echo.
echo ========================================
echo    BACKUP CONCLUÍDO COM SUCESSO!
echo ========================================
echo.
echo 📁 Arquivo criado: %backup_folder%.zip
echo 📍 Localização: %cd%\%backup_folder%.zip
echo.
echo ✅ O backup contém:
echo    - Código fonte completo do projeto
echo    - Script para extrair dados do localStorage
echo    - Documentação completa de restauração
echo.
echo 🔧 Para extrair os dados:
echo    1. Extraia o arquivo ZIP
echo    2. Abra 'extrair-dados.html' no navegador
echo    3. Clique em 'Extrair Dados'
echo.
echo Pressione qualquer tecla para continuar...
pause >nul
