import { supabase } from '../../lib/supabase';
import type { CategoryFormData } from '../../types';

export class SupabaseCategoriesService {
  static async getAll(): Promise<any[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }

    // Transformar dados do Supabase para o formato esperado pela aplicação
    return (data || []).map(category => ({
      id: category.id,
      name: category.name,
      color: category.color,
      kind: category.kind,
      createdAt: category.created_at,
      updatedAt: category.updated_at
    }));
  }

  static async getById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar categoria:', error);
      return null;
    }

    return data;
  }

  static async create(categoryData: CategoryFormData): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          id: this.generateId(),
          name: categoryData.name,
          color: categoryData.color,
          kind: categoryData.kind
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar categoria:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      return null;
    }
  }

  static async update(id: string, updates: Partial<CategoryFormData>): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar categoria:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar categoria:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      return false;
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
