# Controle Financeiro Pessoal - React

Aplicação React moderna com TypeScript e Material-UI para controle financeiro pessoal, implementando a Sprint 1 - Categorias.

## 🚀 Tecnologias Utilizadas

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Material-UI (MUI)** para componentes de UI
- **React Router** para navegação
- **LocalStorage** para persistência de dados
- **Emotion** para estilos CSS-in-JS

## 📋 Funcionalidades Implementadas

### Sprint 1 - Categorias ✅

- **CRUD completo** de categorias (Criar, Ler, Atualizar, Deletar)
- **Tela dividida** em dois painéis: Despesas e Receitas
- **Filtros globais**: Vínculo (Todos | Despesa | Receita) e Categoria
- **Validação** de formulários (nome obrigatório, mínimo 2 caracteres)
- **Persistência** em LocalStorage
- **Interface responsiva** com Material Design
- **Snackbars** para feedback de ações
- **Diálogos de confirmação** para exclusões

### Sprint 2 - Tipos ✅

- **CRUD completo** de tipos com vínculo dinâmico
- **Tela dividida** em dois painéis: Despesas e Receitas
- **Filtros globais**: Vínculo (Todos | Despesa | Receita) e Categoria
- **Vínculo dinâmico**: Categorias filtradas conforme vínculo selecionado
- **Integridade referencial**: Exclusão de categoria remove tipos vinculados
- **Formulário inteligente**: Validação e dependências entre campos

### Sprint 3 - Despesas ✅

- **CRUD completo** de despesas com lançamentos
- **Recorrência mensal**: Criação automática de N despesas mensais
- **Valores em centavos**: Armazenamento preciso com formatação BRL
- **Filtros avançados**: Categoria, Tipo e Mês (YYYY-MM) - **Mês atual por padrão**
- **Integridade referencial**: Exclusão de tipo/categoria remove despesas
- **Formulário inteligente**: Validações e dependências entre campos
- **Gestão inteligente de séries**: Identificação automática de despesas mensais
- **Exclusão seletiva**: Opção de excluir apenas uma despesa ou toda a série mensal

### Sprint 4 - Receitas ✅

- **CRUD completo** de receitas com lançamentos (espelho das despesas)
- **Recorrência mensal**: Criação automática de N receitas mensais
- **Valores em centavos**: Armazenamento preciso com formatação BRL
- **Filtros avançados**: Categoria, Tipo e Mês (YYYY-MM) - **Mês atual por padrão**
- **Integridade referencial**: Exclusão de tipo/categoria remove receitas
- **Formulário inteligente**: Validações e dependências entre campos
- **Gestão inteligente de séries**: Identificação automática de receitas mensais
- **Exclusão seletiva**: Opção de excluir apenas uma receita ou toda a série mensal

### Sprint 5 - Dashboard ✅

- **Filtro global de mês**: Select YYYY-MM no canto superior direito
- **Mês atual pré-carregado**: Filtro padrão aplicado automaticamente
- **6 Cards de resumo**: Receitas/Despesas (Previstas, Executadas, Diferenças)
- **Cores inteligentes**: Verde para receitas, vermelho para despesas
- **Rankings Top 5**: Categorias e tipos com mais movimentações efetivas
- **Cálculos precisos**: Baseados apenas em lançamentos com data efetiva
- **Layout responsivo**: Cards e tabelas adaptáveis a diferentes tamanhos de tela
- **Atualização em tempo real**: Dados recalculados automaticamente ao mudar o mês

### Estrutura da Aplicação

- **Dashboard** - Resumo financeiro com filtro global de mês, cartões e rankings
- **Categorias** - Gerenciamento completo de categorias
- **Tipos** - Gerenciamento completo de tipos com vínculo dinâmico
- **Despesas** - Gerenciamento completo de despesas com recorrência mensal
- **Receitas** - Gerenciamento completo de receitas com recorrência mensal

## 🏗️ Arquitetura

```
src/
├── components/
│   ├── Layout/                    # Layout principal com sidebar
│   ├── Dashboard/                 # Sprint 5 - Dashboard com filtro global e rankings
│   ├── Categories/                # Sprint 1 - Categorias
│   ├── Types/                     # Sprint 2 - Tipos com vínculo dinâmico
│   ├── Expenses/                  # Sprint 3 - Despesas com recorrência mensal
│   ├── Incomes/                   # Sprint 4 - Receitas com recorrência mensal
│   ├── Common/                    # Componentes reutilizáveis
│   └── Placeholders/              # Páginas placeholder
├── services/
│   ├── storageService.ts          # Wrapper LocalStorage
│   ├── categoriesService.ts       # CRUD categorias
│   ├── typesService.ts            # CRUD tipos
│   ├── expensesService.ts         # CRUD despesas
│   └── incomesService.ts          # CRUD receitas
├── types/
│   └── index.ts                   # Interfaces e tipos
└── App.tsx                        # Configuração de rotas e tema
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd financeiro-react
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute a aplicação**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:5173
   ```

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev                    # Servidor de desenvolvimento
npm run build                  # Build de produção
npm run preview                # Preview do build
npm run lint                   # Verificar código

# Criação de componentes
npm run generate component     # Gerar novo componente
```

## 📱 Funcionalidades por Sprint

### Sprint 1 - Gerenciamento de Categorias

- **Criar categoria**: Botão "Nova Categoria" abre diálogo com formulário
- **Editar categoria**: Botão de edição na tabela
- **Excluir categoria**: Botão de exclusão com confirmação
- **Filtrar categorias**: Toggle entre Todos, Despesa e Receita

### Validações

- Nome da categoria: obrigatório, mínimo 2 caracteres
- Tipo: obrigatório (Despesa ou Receita)
- Trim automático do nome

### Persistência

- Dados salvos automaticamente no LocalStorage
- Chave: `categories`
- Estrutura: array de objetos Category

### Sprint 5 - Dashboard com Filtro Global

- **Filtro de mês**: Select YYYY-MM no canto superior direito
- **Mês atual pré-carregado**: Filtro padrão aplicado automaticamente
- **6 Cards de resumo financeiro**:
  - Receitas Previstas (verde)
  - Receitas Executadas (verde)
  - Diferença Receitas (verde/vermelho conforme resultado)
  - Despesas Previstas (vermelho)
  - Despesas Executadas (vermelho)
  - Diferença Despesas (vermelho/verde conforme resultado)

- **Rankings Top 5**:
  - Categorias com mais Despesas efetivas
  - Tipos com mais Despesas efetivas
  - Categorias com mais Receitas efetivas
  - Tipos com mais Receitas efetivas

- **Cálculos inteligentes**:
  - Baseados apenas em lançamentos com data efetiva
  - Filtro global aplicado em todos os cálculos
  - Atualização automática ao mudar o mês selecionado

## 🎨 Interface

- **Material Design** com tema personalizado
- **Layout responsivo** com sidebar lateral
- **Menu de navegação** com ícones intuitivos
- **Tabela de dados** com ações inline
- **Formulários** com validação visual
- **Feedback visual** com snackbars e tooltips

## 🔧 Configurações

### Material-UI

- Tema personalizado com cores primárias
- Localização PT-BR
- Tipografia Roboto
- Ícones Material Icons

### React Router

- Navegação SPA com rotas aninhadas
- Layout persistente entre páginas
- Navegação programática

## 📊 Estrutura de Dados

### Category Model

```typescript
interface Category {
  id: string;        // Gerado automaticamente
  name: string;      // Nome da categoria
  kind: Kind;        // 'Despesa' | 'Receita'
}
```

### Type Model

```typescript
interface Type {
  id: string;        // Gerado automaticamente
  name: string;      // Nome do tipo
  kind: Kind;        // 'Despesa' | 'Receita'
  categoryId: string; // ID da categoria vinculada
}
```

### Expense Model

```typescript
interface Expense {
  id: string;           // Gerado automaticamente
  kind: 'Despesa';      // Sempre 'Despesa'
  categoryId: string;   // ID da categoria
  typeId: string;       // ID do tipo
  value: number;        // Valor em centavos
  datePrevista: string; // Data prevista (YYYY-MM-DD)
  dateEfetiva?: string; // Data efetiva (opcional)
  obs?: string;         // Observação (opcional)
  isMensal?: boolean;   // Identifica se é parte de uma série mensal
  seriesId?: string;    // ID da série para agrupar despesas mensais
}
```

### Income Model

```typescript
interface Income {
  id: string;           // Gerado automaticamente
  kind: 'Receita';      // Sempre 'Receita'
  categoryId: string;   // ID da categoria
  typeId: string;       // ID do tipo
  value: number;        // Valor em centavos
  datePrevista: string; // Data prevista (YYYY-MM-DD)
  dateEfetiva?: string; // Data efetiva (opcional)
  obs?: string;         // Observação (opcional)
  isMensal?: boolean;   // Identifica se é parte de uma série mensal
  seriesId?: string;    // ID da série para agrupar receitas mensais
}
```

### Storage Service

- `get<T>(key)`: Recupera dados
- `set<T>(key, value)`: Salva dados
- `remove(key)`: Remove dados
- `clear()`: Limpa todo o storage

## 🚧 Próximas Sprints

- **Sprint 2**: Tipos de transação ✅
- **Sprint 3**: Despesas ✅
- **Sprint 4**: Receitas ✅
- **Sprint 5**: Dashboard ✅ com relatórios
- **Sprint 6**: Exportação de dados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ usando React 18, TypeScript e Material-UI.

---

**Status**: ✅ Sprint 1 - Categorias - CONCLUÍDA | ✅ Sprint 2 - Tipos - CONCLUÍDA | ✅ Sprint 3 - Despesas - CONCLUÍDA | ✅ Sprint 4 - Receitas - CONCLUÍDA | ✅ Sprint 5 - Dashboard - CONCLUÍDA
**Versão**: 1.0.0
**Última atualização**: Agosto 2024
