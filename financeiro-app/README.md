# Controle Financeiro Pessoal

Aplicação Angular 17+ standalone para controle financeiro pessoal, implementando a Sprint 1 - Categorias.

## 🚀 Tecnologias Utilizadas

- **Angular 17+** com standalone components e Router
- **Angular Material** para componentes de UI
- **Reactive Forms** para formulários
- **LocalStorage** para persistência de dados
- **SCSS** para estilos
- **TypeScript** para tipagem

## 📋 Funcionalidades Implementadas

### Sprint 1 - Categorias ✅

- **CRUD completo** de categorias (Criar, Ler, Atualizar, Deletar)
- **Filtros** por tipo: Todos, Despesa, Receita
- **Validação** de formulários (nome obrigatório, mínimo 2 caracteres)
- **Persistência** em LocalStorage
- **Interface responsiva** com Material Design
- **Snackbars** para feedback de ações
- **Diálogos de confirmação** para exclusões

### Estrutura da Aplicação

- **Dashboard** - Página inicial com cards informativos
- **Categorias** - Gerenciamento completo de categorias
- **Tipos** - Placeholder para futuras funcionalidades
- **Despesas** - Placeholder para futuras funcionalidades
- **Receitas** - Placeholder para futuras funcionalidades

## 🏗️ Arquitetura

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── storage.service.ts          # Wrapper LocalStorage
│   ├── data/
│   │   └── repositories/
│   │       └── categories.repository.ts    # CRUD categorias
│   ├── features/
│   │   ├── categorias/                     # Sprint 1
│   │   ├── dashboard/
│   │   ├── tipos/
│   │   ├── despesas/
│   │   └── receitas/
│   ├── models/
│   │   ├── kind.enum.ts                   # Tipo: Despesa | Receita
│   │   └── category.model.ts              # Interface Category
│   ├── shared/
│   │   ├── components/
│   │   │   └── confirm-dialog/            # Diálogo confirmação
│   │   └── pipes/
│   │       └── brl.pipe.ts                # Formatação monetária BRL
│   └── app.component.ts                    # Layout principal com sidenav
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- Angular CLI 17+

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd financeiro-app
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute a aplicação**
   ```bash
   ng serve
   ```

4. **Acesse no navegador**
   ```
   http://localhost:4200
   ```

### Comandos Úteis

```bash
# Desenvolvimento
ng serve                    # Servidor de desenvolvimento
ng build                   # Build de produção
ng test                    # Executar testes
ng lint                    # Verificar código

# Criação de componentes
ng generate component nome-do-componente --standalone
ng generate service nome-do-servico
ng generate pipe nome-do-pipe --standalone
```

## 📱 Funcionalidades da Sprint 1

### Gerenciamento de Categorias

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

## 🎨 Interface

- **Material Design** com tema indigo-pink
- **Layout responsivo** com sidenav lateral
- **Menu de navegação** com ícones intuitivos
- **Tabela de dados** com ações inline
- **Formulários** com validação visual
- **Feedback visual** com snackbars e tooltips

## 🔧 Configurações

### Angular Material

- Tema: `indigo-pink`
- Tipografia: Roboto
- Ícones: Material Icons

### Internacionalização

- Idioma: PT-BR
- Formatação monetária: BRL (R$)
- Mensagens em português

## 📊 Estrutura de Dados

### Category Model

```typescript
interface Category {
  id: string;        // Gerado automaticamente
  name: string;      // Nome da categoria
  kind: Kind;        // 'Despesa' | 'Receita'
}
```

### Storage Service

- `get<T>(key)`: Recupera dados
- `set<T>(key, value)`: Salva dados
- `patch<T>(key, value)`: Atualiza parcialmente
- `remove(key)`: Remove dados
- `clear()`: Limpa todo o storage

## 🚧 Próximas Sprints

- **Sprint 2**: Tipos de transação
- **Sprint 3**: Despesas
- **Sprint 4**: Receitas
- **Sprint 5**: Dashboard com relatórios
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

Desenvolvido com ❤️ usando Angular 17+ e Angular Material.

---

**Status**: ✅ Sprint 1 - Categorias - CONCLUÍDA
**Versão**: 1.0.0
**Última atualização**: Agosto 2024
