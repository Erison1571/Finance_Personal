import { supabase } from '../../lib/supabase';
import type { ExpenseFormData } from '../../types';
import { addMeses } from '../../utils/date.util';

export class SupabaseExpensesService {
  static async getAll(): Promise<any[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date_prevista', { ascending: false });

    if (error) {
      console.error('Erro ao buscar despesas:', error);
      return [];
    }

    // Transformar dados do Supabase para o formato esperado pela aplicação
    return (data || []).map(expense => ({
      id: expense.id,
      kind: expense.kind,
      categoryId: expense.category_id,
      typeId: expense.type_id,
      value: expense.value, // Usar 'value' (campo correto no Supabase)
      datePrevista: expense.date_prevista,
      dateEfetiva: expense.date_efetiva,
      obs: expense.obs,
      isMensal: expense.is_mensal,
      seriesId: expense.series_id,
      createdAt: expense.created_at,
      updatedAt: expense.updated_at
    }));
  }

  static async getById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar despesa:', error);
      return null;
    }

    return data;
  }

  static async getByCategory(categoryId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('category_id', categoryId)
      .order('date_prevista', { ascending: false });

    if (error) {
      console.error('Erro ao buscar despesas por categoria:', error);
      return [];
    }

    return data || [];
  }

  static async getByType(typeId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('type_id', typeId)
      .order('date_prevista', { ascending: false });

    if (error) {
      console.error('Erro ao buscar despesas por tipo:', error);
      return [];
    }

    return data || [];
  }

  static async getByMonth(monthYear: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .like('date_prevista', `${monthYear}%`)
      .order('date_prevista', { ascending: false });

    if (error) {
      console.error('Erro ao buscar despesas por mês:', error);
      return [];
    }

    return data || [];
  }

  static async create(expenseData: ExpenseFormData): Promise<any[]> {
    try {
      const newExpenses: any[] = [];

      if (expenseData.isMensal && expenseData.quantidadeMeses && expenseData.quantidadeMeses > 0) {
        // Criar despesas recorrentes
        const seriesId = this.generateId();
        
        for (let i = 0; i < expenseData.quantidadeMeses; i++) {
          const datePrevista = i === 0 
            ? expenseData.datePrevista 
            : addMeses(expenseData.datePrevista, i);
          
          const dateEfetiva = expenseData.dateEfetiva && i === 0 
            ? expenseData.dateEfetiva 
            : undefined;

          const { data, error } = await supabase
            .from('expenses')
            .insert({
              id: this.generateId(),
              kind: 'Despesa',
              category_id: expenseData.categoryId,
              type_id: expenseData.typeId,
              value: expenseData.value,
              date_prevista: datePrevista,
              date_efetiva: dateEfetiva,
              obs: expenseData.obs,
              is_mensal: true,
              series_id: seriesId
            })
            .select()
            .single();

          if (error) {
            console.error('Erro ao criar despesa recorrente:', error);
            continue;
          }

          newExpenses.push(data);
        }
      } else {
        // Criar despesa única
        const { data, error } = await supabase
          .from('expenses')
          .insert({
            id: this.generateId(),
            kind: 'Despesa',
            category_id: expenseData.categoryId,
            type_id: expenseData.typeId,
            value: expenseData.value,
            date_prevista: expenseData.datePrevista,
            date_efetiva: expenseData.dateEfetiva,
            obs: expenseData.obs
          })
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar despesa:', error);
          return [];
        }

        newExpenses.push(data);
      }

      return newExpenses;
    } catch (error) {
      console.error('Erro ao criar despesa(s):', error);
      return [];
    }
  }

  static async update(id: string, updates: Partial<ExpenseFormData>): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar despesa:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar despesa:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar despesa:', error);
      return false;
    }
  }

  static async deleteByCategory(categoryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('category_id', categoryId);

      if (error) {
        console.error('Erro ao deletar despesas por categoria:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar despesas por categoria:', error);
      return false;
    }
  }

  static async deleteByType(typeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('type_id', typeId);

      if (error) {
        console.error('Erro ao deletar despesas por tipo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar despesas por tipo:', error);
      return false;
    }
  }

  static async getBySeries(seriesId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('series_id', seriesId)
      .order('date_prevista', { ascending: true });

    if (error) {
      console.error('Erro ao buscar despesas por série:', error);
      return [];
    }

    return data || [];
  }

  static async deleteBySeries(seriesId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('series_id', seriesId);

      if (error) {
        console.error('Erro ao deletar despesas por série:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar despesas por série:', error);
      return false;
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
