# Funcionalidade de Exportar para PDF

## Visão Geral

Esta funcionalidade permite exportar relatórios de Despesas e Receitas para arquivos PDF, incluindo todos os filtros aplicados e dados resumidos.

## Como Usar

### 1. Na Página de Despesas

1. Acesse a página de Despesas
2. Aplique os filtros desejados (Categoria, Tipo, Mês)
3. Clique no botão **"Exportar PDF"** (ícone de PDF vermelho)
4. O arquivo será baixado automaticamente com o nome `despesas_YYYY-MM-DD.pdf`

### 2. Na Página de Receitas

1. Acesse a página de Receitas
2. Aplique os filtros desejados (Categoria, Tipo, Mês)
3. Clique no botão **"Exportar PDF"** (ícone de PDF verde)
4. O arquivo será baixado automaticamente com o nome `receitas_YYYY-MM-DD.pdf`

## Conteúdo do PDF

### Cabeçalho
- Título do relatório
- Filtros aplicados (se houver)
- Data e hora de geração

### Resumo
- Total em valores
- Quantidade de itens
- Itens em aberto vs. fechados

### Tabela Detalhada
- Categoria
- Tipo
- Valor
- Data Prevista
- Data Efetiva
- Observações

## Filtros Aplicados

O PDF sempre reflete os filtros atualmente aplicados na interface:
- **Categoria**: Se uma categoria específica estiver selecionada
- **Tipo**: Se um tipo específico estiver selecionado
- **Mês**: Se um mês específico estiver selecionado

## Dependências

- `jspdf`: Biblioteca principal para geração de PDFs
- `jspdf-autotable`: Plugin para criação de tabelas no PDF

## Arquivos Modificados

- `src/services/pdfExportService.ts` - Serviço principal de exportação
- `src/components/Expenses/Expenses.tsx` - Componente de Despesas com botão de exportar
- `src/components/Incomes/Incomes.tsx` - Componente de Receitas com botão de exportar
- `src/services/index.ts` - Arquivo de índice dos serviços

## Tratamento de Erros

- Se houver erro na geração do PDF, uma mensagem de erro será exibida
- Logs de erro são registrados no console para debugging
- O usuário recebe feedback visual através de snackbars

## Personalização

O serviço de PDF pode ser facilmente personalizado:
- Cores dos cabeçalhos das tabelas
- Tamanho das fontes
- Layout e espaçamento
- Conteúdo adicional (gráficos, logos, etc.)

## Compatibilidade

- Funciona em todos os navegadores modernos
- Gera PDFs padrão compatíveis com qualquer leitor de PDF
- Suporte completo a caracteres especiais e acentuação portuguesa
