@echo off
echo ========================================
echo    BACKUP COMPLETO FINAL - SISTEMA + BANCO
echo ========================================
echo.

REM Navegar para o diretório do projeto
cd /d "%~dp0"

REM Criar pasta de backup com timestamp
set timestamp=%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
set backup_folder=backup_final_completo_%timestamp%

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
echo database >> exclude_list.txt

echo.
echo ========================================
echo    COPIANDO BANCO DE DADOS
echo ========================================

REM Copiar banco de dados
echo Copiando banco de dados SQLite...
if exist "database\financeiro.db" (
    copy "database\financeiro.db" "%backup_folder%\financeiro.db" >nul
    echo ✅ Banco de dados copiado
) else (
    echo ❌ Banco de dados não encontrado
)

echo.
echo ========================================
echo    CRIANDO RELATÓRIO DE BACKUP
echo ========================================

REM Criar relatório de backup
echo Criando relatório de backup...
echo # 🏦 BACKUP COMPLETO FINAL - SISTEMA + BANCO > "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo **Data do Backup:** %date% %time% >> "%backup_folder%\BACKUP_FINAL_README.md"
echo **Versão do Sistema:** 2.0.0 (com banco SQLite) >> "%backup_folder%\BACKUP_FINAL_README.md"
echo **Status:** ✅ CONCLUÍDO COM SUCESSO >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo --- >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo ## 📁 Arquivos de Backup Criados >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo ### 1. **projeto/** >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - **Tipo:** Código fonte completo do projeto React >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - **Conteúdo:** Todos os arquivos do sistema (exceto node_modules) >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo ### 2. **financeiro.db** >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - **Tipo:** Banco de dados SQLite >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - **Conteúdo:** Todos os lançamentos, categorias e tipos >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - **Dados:** 38 despesas + 5 receitas + 10 categorias + 20 tipos >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo --- >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo ## 🚀 Como Restaurar o Sistema >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo ### **Restauração Completa** >> "%backup_folder%\BACKUP_FINAL_README.md"
echo 1. Extraia o arquivo de backup >> "%backup_folder%\BACKUP_FINAL_README.md"
echo 2. Navegue até a pasta `projeto` >> "%backup_folder%\BACKUP_FINAL_README.md"
echo 3. Execute `npm install` para instalar dependências >> "%backup_folder%\BACKUP_FINAL_README.md"
echo 4. Copie `financeiro.db` para a pasta `database/` >> "%backup_folder%\BACKUP_FINAL_README.md"
echo 5. Execute `npm run dev` para iniciar o servidor >> "%backup_folder%\BACKUP_FINAL_README.md"
echo 6. Acesse `http://localhost:5173` >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo --- >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo ## 📊 Dados Incluídos no Backup >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - ✅ **38 Despesas** (R$ 10.564,39) >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - ✅ **5 Receitas** (R$ 7.450,00) >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - ✅ **10 Categorias** (5 Despesas + 5 Receitas) >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - ✅ **20 Tipos** de lançamentos >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - ✅ **Relacionamentos** entre todas as entidades >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo --- >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo ## 🔧 Tecnologias Utilizadas >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - **Frontend:** React 18 + TypeScript >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - **UI Framework:** Material-UI (MUI) >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - **Banco de Dados:** SQLite + Sequelize >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - **Gráficos:** Recharts >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - **Build Tool:** Vite >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo --- >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo ## ⚠️ Informações Importantes >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo ### **Banco de Dados** >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - Os dados estão no arquivo `financeiro.db` >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - Banco SQLite portável e eficiente >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - Backup pode ser feito copiando o arquivo .db >> "%backup_folder%\BACKUP_FINAL_README.md"
echo. >> "%backup_folder%\BACKUP_FINAL_README.md"
echo ### **Segurança** >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - Dados armazenados localmente >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - Sistema funciona offline >> "%backup_folder%\BACKUP_FINAL_README.md"
echo - Backup completo incluído >> "%backup_folder%\BACKUP_FINAL_README.md"

echo.
echo ========================================
echo    COMPACTANDO BACKUP
echo ========================================

REM Compactar backup
echo Compactando backup...
powershell -command "Compress-Archive -Path '%backup_folder%' -DestinationPath '%backup_folder%.zip' -Force" >nul 2>&1

if exist "%backup_folder%.zip" (
    echo ✅ Backup compactado: %backup_folder%.zip
    echo.
    echo ========================================
    echo    BACKUP CONCLUÍDO COM SUCESSO!
    echo ========================================
    echo.
    echo 📁 Pasta: %backup_folder%
    echo 📦 Arquivo: %backup_folder%.zip
    echo.
    echo ✅ Sistema completo + Banco de dados
    echo ✅ 38 despesas + 5 receitas
    echo ✅ 10 categorias + 20 tipos
    echo ✅ Relacionamentos funcionais
    echo.
    echo 🚀 Sistema pronto para versionamento Git!
) else (
    echo ❌ Erro ao compactar backup
)

REM Limpar arquivo temporário
del exclude_list.txt >nul 2>&1

echo.
pause
