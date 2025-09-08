# Sprint 6 - Controle Financeiro Pessoal

## Implementação Completa das Funcionalidades

### ✅ Funcionalidades Implementadas

#### 1. **Editar e Efetivar Lançamentos**
- **Despesas**: Botões Editar e Efetivar em cada linha da tabela
- **Receitas**: Botões Editar e Efetivar em cada linha da tabela
- **Efetivar**: Só aparece quando `dateEfetiva` estiver vazia
- **Diálogo de Efetivação**: Formulário com data efetiva (padrão: hoje) e observação

#### 2. **Dashboard Atualizado**
- **Filtro de Mês Centralizado**: Seletor de mês no topo centralizado
- **Card de Saldo**: Exibe saldo do mês (Receitas - Despesas) no padrão visual
- **Ações nos Lançamentos**: Botões Editar/Efetivar em todas as listagens
- **Chips de Status**: Indicadores visuais para lançamentos em aberto

#### 3. **Sistema de Alertas**
- **Chips de Alerta**: 
  - 🔴 **VERMELHO**: Atrasado (datePrevista < hoje)
  - 🟡 **AMARELO**: Pendente (datePrevista ≥ hoje)
- **Menu de Alertas**: Ícone de sino na toolbar com badge numérico
- **Lista de Alertas**: Todos os lançamentos em aberto com ações rápidas

#### 4. **Persistência e Repositórios**
- **LocalStorage**: Todos os dados persistem localmente
- **Repositórios**: CRUD completo para Despesas, Receitas, Categorias e Tipos
- **Métodos Update**: Implementados para edição e efetivação

### 🏗️ Arquitetura Implementada

#### **Modelos de Dados**
```typescript
// Despesas e Receitas
interface Expense/Income {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  typeId: string;
  dateExpected: string;      // YYYY-MM-DD
  dateEffective?: string;    // YYYY-MM-DD (opcional)
  observation?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### **Utilitários de Data**
```typescript
class DateUtil {
  static isTodayOrFuture(dateStr: string): boolean
  static isPast(dateStr: string): boolean
  static isToday(dateStr: string): boolean
  static formatDate(dateStr: string): string
  static getTodayISO(): string
  static isInMonth(dateStr: string, year: number, month: number): boolean
}
```

#### **Componentes de Diálogo**
- `ExpenseDialogComponent`: Criar/Editar despesas
- `IncomeDialogComponent`: Criar/Editar receitas  
- `EffectiveDialogComponent`: Efetivar lançamentos
- `AlertsMenuComponent`: Menu de alertas na toolbar

### 🎨 Interface do Usuário

#### **Cores dos Alertas**
- **Vermelho (warn)**: `#f44336` - Para atrasos
- **Amarelo (custom)**: `#F59E0B` - Para pendências
- **Verde**: `#4caf50` - Para efetivados

#### **Layout Responsivo**
- **Dashboard**: Cards em grid responsivo
- **Tabelas**: Paginação e ordenação
- **Filtros**: Categoria, Tipo e Mês
- **Toolbar**: Menu de alertas com badge

### 🔧 Como Usar

#### **1. Criar Lançamento**
- Clique em "Nova Despesa" ou "Nova Receita"
- Preencha os campos obrigatórios
- Selecione categoria e tipo
- Defina data prevista

#### **2. Editar Lançamento**
- Clique no ícone de editar (lápis) na linha desejada
- Modifique os campos necessários
- Salve as alterações

#### **3. Efetivar Lançamento**
- Clique no ícone de efetivar (check) na linha desejada
- Confirme a data efetiva (padrão: hoje)
- Adicione observações se necessário
- Confirme a efetivação

#### **4. Visualizar Alertas**
- Clique no ícone de sino na toolbar
- Visualize todos os lançamentos em aberto
- Use as ações rápidas para editar/efetivar

#### **5. Filtrar por Mês**
- No Dashboard, use o seletor de mês centralizado
- Visualize saldo e lançamentos do período selecionado

### 📱 Componentes Principais

#### **Dashboard**
- Filtro de mês centralizado
- Cards de resumo (Receitas, Despesas, Saldo)
- Lista de lançamentos em aberto com ações

#### **Despesas/Receitas**
- Tabela com filtros (Categoria, Tipo, Mês)
- Ações por linha (Editar, Efetivar, Excluir)
- Chips de status (Atrasado, Pendente, Efetivado)

#### **Menu de Alertas**
- Badge com contagem de lançamentos em aberto
- Lista organizada por prioridade (atrasados primeiro)
- Ações rápidas para cada item

### 🚀 Tecnologias Utilizadas

- **Angular 17+**: Standalone components
- **Angular Material**: UI components e theming
- **Reactive Forms**: Formulários reativos
- **date-fns**: Manipulação de datas
- **LocalStorage**: Persistência local
- **TypeScript**: Tipagem estática

### 📊 Regras de Negócio

#### **Cálculo de Saldo**
```
Saldo (mês) = Σ(Receitas Efetivadas) - Σ(Despesas Efetivadas)
```

#### **Status dos Lançamentos**
- **Atrasado**: `!dateEfetiva && datePrevista < hoje`
- **Pendente**: `!dateEfetiva && datePrevista ≥ hoje`
- **Efetivado**: `dateEfetiva` preenchida

#### **Filtros de Mês**
- Baseados na data prevista para lançamentos em aberto
- Baseados na data efetiva para cálculos de saldo

### 🔍 Funcionalidades Futuras

- **Relatórios**: Gráficos e análises
- **Exportação**: CSV, PDF
- **Backup**: Sincronização com nuvem
- **Metas**: Planejamento financeiro
- **Lembretes**: Notificações automáticas

### 📝 Notas de Implementação

- Todos os componentes são standalone
- Uso consistente de Angular Material
- Padrões de acessibilidade implementados
- Feedback visual com MatSnackBar
- Confirmações antes de ações destrutivas
- Responsividade para diferentes tamanhos de tela

---

**Status**: ✅ **IMPLEMENTAÇÃO COMPLETA**
**Data**: Sprint 6
**Versão**: 1.0.0
