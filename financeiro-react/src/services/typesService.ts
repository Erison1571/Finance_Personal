import type { Type, TypeFormData, Kind } from '../types';
import { StorageService } from './storageService';
import { ExpensesService } from './expensesService';
import { IncomesService } from './incomesService';

const STORAGE_KEY = 'types';

export class TypesService {
  static getAll(): Type[] {
    return StorageService.get<Type[]>(STORAGE_KEY) || [];
  }

  static getById(id: string): Type | undefined {
    const types = this.getAll();
    return types.find(type => type.id === id);
  }

  static getByKind(kind: Kind): Type[] {
    const types = this.getAll();
    return types.filter(type => type.kind === kind);
  }

  static getByCategory(categoryId: string): Type[] {
    const types = this.getAll();
    return types.filter(type => type.categoryId === categoryId);
  }

  static create(typeData: TypeFormData): Type | null {
    try {
      const types = this.getAll();
      const newType: Type = {
        ...typeData,
        id: this.generateId()
      };
      
      types.push(newType);
      
      if (StorageService.set(STORAGE_KEY, types)) {
        return newType;
      }
      return null;
    } catch (error) {
      console.error('Erro ao criar tipo:', error);
      return null;
    }
  }

  static update(id: string, updates: Partial<TypeFormData>): Type | null {
    try {
      const types = this.getAll();
      const index = types.findIndex(type => type.id === id);
      
      if (index === -1) return null;
      
      types[index] = { ...types[index], ...updates };
      
      if (StorageService.set(STORAGE_KEY, types)) {
        return types[index];
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar tipo:', error);
      return null;
    }
  }

  static delete(id: string): boolean {
    try {
      const types = this.getAll();
      const filteredTypes = types.filter(type => type.id !== id);
      
      if (filteredTypes.length === types.length) {
        return false; // Tipo não encontrado
      }
      
      // Remover despesas vinculadas ao tipo
      ExpensesService.deleteByType(id);
      
      // Remover receitas vinculadas ao tipo
      IncomesService.deleteByType(id);
      
      return StorageService.set(STORAGE_KEY, filteredTypes);
    } catch (error) {
      console.error('Erro ao deletar tipo:', error);
      return false;
    }
  }

  static deleteByCategory(categoryId: string): boolean {
    try {
      const types = this.getAll();
      const filteredTypes = types.filter(type => type.categoryId !== categoryId);
      
      if (filteredTypes.length === types.length) {
        return true; // Nenhum tipo encontrado para essa categoria
      }
      
      return StorageService.set(STORAGE_KEY, filteredTypes);
    } catch (error) {
      console.error('Erro ao deletar tipos por categoria:', error);
      return false;
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
