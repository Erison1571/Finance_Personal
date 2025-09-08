import { supabase } from '../../lib/supabase';
import type { TypeFormData } from '../../types';

export class SupabaseTypesService {
  static async getAll(): Promise<any[]> {
    const { data, error } = await supabase
      .from('types')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar tipos:', error);
      return [];
    }

    return data || [];
  }

  static async getById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('types')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar tipo:', error);
      return null;
    }

    return data;
  }

  static async getByCategory(categoryId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('types')
      .select('*')
      .eq('category_id', categoryId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar tipos por categoria:', error);
      return [];
    }

    return data || [];
  }

  static async create(typeData: TypeFormData): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('types')
        .insert({
          id: this.generateId(),
          name: typeData.name,
          category_id: typeData.categoryId
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar tipo:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar tipo:', error);
      return null;
    }
  }

  static async update(id: string, updates: Partial<TypeFormData>): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar tipo:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar tipo:', error);
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('types')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar tipo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar tipo:', error);
      return false;
    }
  }

  static async deleteByCategory(categoryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('types')
        .delete()
        .eq('category_id', categoryId);

      if (error) {
        console.error('Erro ao deletar tipos por categoria:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar tipos por categoria:', error);
      return false;
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
