# Gráficos no Dashboard - Controle Financeiro

## Funcionalidades Implementadas

### 📊 Gráficos de Análise de Despesas

O Dashboard agora inclui gráficos interativos que mostram as categorias e tipos de despesas com mais lançamentos efetivados, considerando o filtro de mês aplicado.

#### 🎯 Características dos Gráficos

1. **Gráficos de Categorias de Despesas**
   - **Gráfico de Barras**: Mostra as top 8 categorias de despesas por valor total
   - **Gráfico de Pizza**: Exibe a distribuição percentual das categorias
   - Cores diferenciadas para cada categoria
   - Tooltips informativos com valores formatados em BRL

2. **Gráficos de Tipos de Despesas**
   - **Gráfico de Barras**: Mostra os top 8 tipos de despesas por valor total
   - **Gráfico de Pizza**: Exibe a distribuição percentual dos tipos
   - Cores diferenciadas para cada tipo
   - Tooltips informativos com valores formatados em BRL

#### 🔧 Tecnologias Utilizadas

- **Recharts**: Biblioteca de gráficos para React
- **Material-UI**: Componentes de interface
- **TypeScript**: Tipagem estática

#### 📈 Dados Exibidos

- **Valor Total**: Soma dos valores das despesas efetivadas por categoria/tipo
- **Quantidade de Lançamentos**: Número de despesas efetivadas por categoria/tipo
- **Percentual**: Distribuição percentual no gráfico de pizza
- **Filtro por Mês**: Dados são filtrados conforme o mês selecionado

#### 🎨 Design Responsivo

- Layout flexível que se adapta a diferentes tamanhos de tela
- Gráficos responsivos que se ajustam ao container
- Cores consistentes e profissionais
- Tooltips informativos com formatação de moeda brasileira

#### ⚡ Atualização Automática

- Os gráficos são atualizados automaticamente a cada 5 segundos
- Atualização manual através do botão "Atualizar"
- Dados são recalculados quando o filtro de mês é alterado

#### 📱 Responsividade

- **Desktop**: Gráficos lado a lado (barras + pizza)
- **Mobile**: Gráficos empilhados verticalmente
- **Tablet**: Layout adaptativo conforme o espaço disponível

### 🚀 Como Usar

1. Acesse o Dashboard
2. Selecione o mês desejado no filtro
3. Os gráficos serão exibidos automaticamente se houver despesas efetivadas
4. Passe o mouse sobre os gráficos para ver detalhes
5. Use o botão "Atualizar" para forçar a atualização dos dados

### 📊 Informações dos Gráficos

- **Eixo X (Barras)**: Nome da categoria/tipo
- **Eixo Y (Barras)**: Valor total em BRL
- **Labels (Pizza)**: Nome e percentual
- **Cores**: Cada categoria/tipo tem uma cor única
- **Tooltips**: Valores formatados e informações detalhadas

### 🔄 Atualizações Futuras

- Possibilidade de exportar gráficos como imagem
- Filtros adicionais (período personalizado, faixa de valores)
- Gráficos comparativos entre meses
- Animações de transição entre dados
