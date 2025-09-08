import { Injectable } from '@angular/core';
import { Category } from '../../models/category.model';
import { StorageService } from '../../core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesRepository {
  private readonly STORAGE_KEY = 'categories';

  constructor(private storageService: StorageService) { }

  getAll(): Category[] {
    return this.storageService.get<Category[]>(this.STORAGE_KEY) || [];
  }

  getById(id: string): Category | undefined {
    const categories = this.getAll();
    return categories.find(cat => cat.id === id);
  }

  create(category: Omit<Category, 'id'>): Category | null {
    try {
      const categories = this.getAll();
      const newCategory: Category = {
        ...category,
        id: this.generateId()
      };
      
      categories.push(newCategory);
      
      if (this.storageService.set(this.STORAGE_KEY, categories)) {
        return newCategory;
      }
      return null;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      return null;
    }
  }

  update(id: string, updates: Partial<Omit<Category, 'id'>>): Category | null {
    try {
      const categories = this.getAll();
      const index = categories.findIndex(cat => cat.id === id);
      
      if (index === -1) return null;
      
      categories[index] = { ...categories[index], ...updates };
      
      if (this.storageService.set(this.STORAGE_KEY, categories)) {
        return categories[index];
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      return null;
    }
  }

  delete(id: string): boolean {
    try {
      const categories = this.getAll();
      const filteredCategories = categories.filter(cat => cat.id !== id);
      
      if (filteredCategories.length === categories.length) {
        return false; // Categoria não encontrada
      }
      
      return this.storageService.set(this.STORAGE_KEY, filteredCategories);
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      return false;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
