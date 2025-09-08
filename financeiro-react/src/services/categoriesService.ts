import type { Category, CategoryFormData } from '../types';
import { StorageService } from './storageService';
import { TypesService } from './typesService';
import { ExpensesService } from './expensesService';
import { IncomesService } from './incomesService';

const STORAGE_KEY = 'categories';

export class CategoriesService {
  static getAll(): Category[] {
    return StorageService.get<Category[]>(STORAGE_KEY) || [];
  }

  static getById(id: string): Category | undefined {
    const categories = this.getAll();
    return categories.find(cat => cat.id === id);
  }

  static create(categoryData: CategoryFormData): Category | null {
    try {
      const categories = this.getAll();
      const newCategory: Category = {
        ...categoryData,
        id: this.generateId()
      };
      
      categories.push(newCategory);
      
      if (StorageService.set(STORAGE_KEY, categories)) {
        return newCategory;
      }
      return null;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      return null;
    }
  }

  static update(id: string, updates: Partial<CategoryFormData>): Category | null {
    try {
      const categories = this.getAll();
      const index = categories.findIndex(cat => cat.id === id);
      
      if (index === -1) return null;
      
      categories[index] = { ...categories[index], ...updates };
      
      if (StorageService.set(STORAGE_KEY, categories)) {
        return categories[index];
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      return null;
    }
  }

  static delete(id: string): boolean {
    try {
      const categories = this.getAll();
      const filteredCategories = categories.filter(cat => cat.id !== id);
      
      if (filteredCategories.length === categories.length) {
        return false; // Categoria não encontrada
      }
      
      // Remover tipos vinculados à categoria
      TypesService.deleteByCategory(id);
      
      // Remover despesas vinculadas à categoria
      ExpensesService.deleteByCategory(id);
      
      // Remover receitas vinculadas à categoria
      IncomesService.deleteByCategory(id);
      
      return StorageService.set(STORAGE_KEY, filteredCategories);
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      return false;
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
