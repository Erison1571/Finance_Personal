# Sistema de Backup - Controle Financeiro

## 📁 Pasta de Backups

Esta pasta contém os arquivos de backup gerados pelo sistema de controle financeiro.

## 🔧 Funcionalidades

### 1. **Criação de Backup**
- Exporta todos os dados financeiros (categorias, tipos, despesas, receitas)
- Gera arquivo JSON com timestamp
- Salva automaticamente no localStorage para referência
- Registra log de operação

### 2. **Histórico de Backups**
- Lista todos os backups realizados
- Mostra data/hora, nome do arquivo, tamanho e status
- Paginação para melhor organização
- Opção de limpar histórico

### 3. **Backups Salvos**
- Lista backups armazenados localmente
- Mostra estatísticas de cada backup
- Opções para restaurar ou excluir backups
- Ordenação por data (mais recente primeiro)

### 4. **Restauração de Dados**
- Restaura dados de um backup específico
- Substitui todos os dados atuais
- Confirmação antes da restauração
- Feedback visual de sucesso/erro

## 📊 Estrutura do Backup

```json
{
  "categories": [...],
  "types": [...],
  "expenses": [...],
  "incomes": [...],
  "timestamp": "2025-09-06T20:30:00.000Z",
  "version": "1.0.0"
}
```

## 🚀 Como Usar

1. **Acesse** a página de Configurações
2. **Clique** na aba "Backup"
3. **Clique** em "Fazer Backup" para criar um novo backup
4. **Consulte** o histórico para ver backups realizados
5. **Gerencie** backups salvos na seção "Backups Salvos"

## ⚠️ Importante

- Os backups são salvos no localStorage do navegador
- Para backup permanente, baixe os arquivos JSON
- A restauração substitui todos os dados atuais
- Sempre faça backup antes de restaurar dados

## 🔄 Manutenção

- O sistema mantém apenas os últimos 50 logs
- Backups antigos podem ser excluídos para liberar espaço
- Use a opção "Limpar histórico" para resetar logs
