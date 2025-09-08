export type Kind = 'Despesa' | 'Receita';

export interface Category {
  id: string;
  name: string;
  color: string;
  kind: Kind;
}

export interface CategoryFormData {
  name: string;
  color: string;
  kind: Kind;
}

export interface Type {
  id: string;
  name: string;
  kind: Kind;
  categoryId: string;
}

export interface TypeFormData {
  name: string;
  kind: Kind;
  categoryId: string;
}

export interface BaseEntry {
  id: string;
  categoryId: string;
  typeId: string;
  value: number; // em centavos
  datePrevista: string; // YYYY-MM-DD
  dateEfetiva?: string; // YYYY-MM-DD (opcional)
  obs?: string; // observação (opcional)
}

export interface Expense extends BaseEntry {
  kind: 'Despesa';
  isMensal?: boolean; // Identifica se é parte de uma série mensal
  seriesId?: string;   // ID da série para agrupar despesas mensais
}

export interface Income extends BaseEntry {
  kind: 'Receita';
  isMensal?: boolean; // Identifica se é parte de uma série mensal
  seriesId?: string;   // ID da série para agrupar receitas mensais
}

export interface ExpenseFormData {
  categoryId: string;
  typeId: string;
  value: number; // em centavos
  datePrevista: string; // YYYY-MM-DD
  dateEfetiva?: string; // YYYY-MM-DD (opcional)
  obs?: string;
  isMensal: boolean;
  quantidadeMeses?: number; // 1-120
}

export interface IncomeFormData {
  categoryId: string;
  typeId: string;
  value: number; // em centavos
  datePrevista: string; // YYYY-MM-DD
  dateEfetiva?: string; // YYYY-MM-DD (opcional)
  obs?: string;
  isMensal: boolean;
  quantidadeMeses?: number; // 1-120
}
