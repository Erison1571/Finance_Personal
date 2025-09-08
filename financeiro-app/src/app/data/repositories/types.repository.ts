import { Injectable } from '@angular/core';
import { Type } from '../../models/type.model';
import { StorageService } from '../../core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TypesRepository {
  private readonly STORAGE_KEY = 'types';

  constructor(private storageService: StorageService) { }

  getAll(): Type[] {
    return this.storageService.get<Type[]>(this.STORAGE_KEY) || [];
  }

  getById(id: string): Type | undefined {
    const types = this.getAll();
    return types.find(type => type.id === id);
  }

  create(type: Omit<Type, 'id' | 'createdAt' | 'updatedAt'>): Type | null {
    try {
      const types = this.getAll();
      const now = new Date().toISOString();
      const newType: Type = {
        ...type,
        id: this.generateId(),
        createdAt: now,
        updatedAt: now
      };
      
      types.push(newType);
      
      if (this.storageService.set(this.STORAGE_KEY, types)) {
        return newType;
      }
      return null;
    } catch (error) {
      console.error('Erro ao criar tipo:', error);
      return null;
    }
  }

  update(id: string, updates: Partial<Omit<Type, 'id' | 'createdAt'>>): Type | null {
    try {
      const types = this.getAll();
      const index = types.findIndex(type => type.id === id);
      
      if (index === -1) return null;
      
      types[index] = { 
        ...types[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      
      if (this.storageService.set(this.STORAGE_KEY, types)) {
        return types[index];
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar tipo:', error);
      return null;
    }
  }

  delete(id: string): boolean {
    try {
      const types = this.getAll();
      const filteredTypes = types.filter(type => type.id !== id);
      
      if (filteredTypes.length === types.length) {
        return false; // Tipo não encontrado
      }
      
      return this.storageService.set(this.STORAGE_KEY, filteredTypes);
    } catch (error) {
      console.error('Erro ao deletar tipo:', error);
      return false;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
