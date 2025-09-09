import { supabase } from '../../lib/supabase';
import type { IncomeFormData } from '../../types';
import { addMeses } from '../../utils/date.util';

export class SupabaseIncomesService {
  static async getAll(): Promise<any[]> {
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .order('date_prevista', { ascending: false });

    if (error) {
      console.error('Erro ao buscar receitas:', error);
      return [];
    }

    // Transformar dados do Supabase para o formato esperado pela aplicação
    return (data || []).map(income => ({
      id: income.id,
      kind: income.kind,
      categoryId: income.category_id,
      typeId: income.type_id,
      value: income.value, // Usar 'value' (campo correto no Supabase)
      datePrevista: income.date_prevista,
      dateEfetiva: income.date_efetiva,
      obs: income.obs,
      isMensal: income.is_mensal,
      seriesId: income.series_id,
      createdAt: income.created_at,
      updatedAt: income.updated_at
    }));
  }

  static async getById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar receita:', error);
      return null;
    }

    return data;
  }

  static async getByCategory(categoryId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .eq('category_id', categoryId)
      .order('date_prevista', { ascending: false });

    if (error) {
      console.error('Erro ao buscar receitas por categoria:', error);
      return [];
    }

    return data || [];
  }

  static async getByType(typeId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .eq('type_id', typeId)
      .order('date_prevista', { ascending: false });

    if (error) {
      console.error('Erro ao buscar receitas por tipo:', error);
      return [];
    }

    return data || [];
  }

  static async getByMonth(monthYear: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .like('date_prevista', `${monthYear}%`)
      .order('date_prevista', { ascending: false });

    if (error) {
      console.error('Erro ao buscar receitas por mês:', error);
      return [];
    }

    return data || [];
  }

  static async create(incomeData: IncomeFormData): Promise<any[]> {
    try {
      const newIncomes: any[] = [];

      if (incomeData.isMensal && incomeData.quantidadeMeses && incomeData.quantidadeMeses > 0) {
        // Criar receitas recorrentes
        const seriesId = this.generateId();
        
        for (let i = 0; i < incomeData.quantidadeMeses; i++) {
          const datePrevista = i === 0 
            ? incomeData.datePrevista 
            : addMeses(incomeData.datePrevista, i);
          
          const dateEfetiva = incomeData.dateEfetiva && i === 0 
            ? incomeData.dateEfetiva 
            : undefined;

          const { data, error } = await supabase
            .from('incomes')
            .insert({
              id: this.generateId(),
              kind: 'Receita',
              category_id: incomeData.categoryId,
              type_id: incomeData.typeId,
              value: incomeData.value,
              date_prevista: datePrevista,
              date_efetiva: dateEfetiva,
              obs: incomeData.obs,
              is_mensal: true,
              series_id: seriesId
            })
            .select()
            .single();

          if (error) {
            console.error('Erro ao criar receita recorrente:', error);
            continue;
          }

          newIncomes.push(data);
        }
      } else {
        // Criar receita única
        const { data, error } = await supabase
          .from('incomes')
          .insert({
            id: this.generateId(),
            kind: 'Receita',
            category_id: incomeData.categoryId,
            type_id: incomeData.typeId,
            value: incomeData.value,
            date_prevista: incomeData.datePrevista,
            date_efetiva: incomeData.dateEfetiva,
            obs: incomeData.obs
          })
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar receita:', error);
          return [];
        }

        newIncomes.push(data);
      }

      return newIncomes;
    } catch (error) {
      console.error('Erro ao criar receita(s):', error);
      return [];
    }
  }

  static async update(id: string, updates: Partial<IncomeFormData>): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('incomes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar receita:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('incomes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar receita:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar receita:', error);
      return false;
    }
  }

  static async deleteByCategory(categoryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('incomes')
        .delete()
        .eq('category_id', categoryId);

      if (error) {
        console.error('Erro ao deletar receitas por categoria:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar receitas por categoria:', error);
      return false;
    }
  }

  static async deleteByType(typeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('incomes')
        .delete()
        .eq('type_id', typeId);

      if (error) {
        console.error('Erro ao deletar receitas por tipo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar receitas por tipo:', error);
      return false;
    }
  }

  static async getBySeries(seriesId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .eq('series_id', seriesId)
      .order('date_prevista', { ascending: true });

    if (error) {
      console.error('Erro ao buscar receitas por série:', error);
      return [];
    }

    return data || [];
  }

  static async deleteBySeries(seriesId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('incomes')
        .delete()
        .eq('series_id', seriesId);

      if (error) {
        console.error('Erro ao deletar receitas por série:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar receitas por série:', error);
      return false;
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
