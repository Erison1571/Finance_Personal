import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Erro ao ler do localStorage para chave ${key}:`, error);
      return null;
    }
  }

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Erro ao escrever no localStorage para chave ${key}:`, error);
      return false;
    }
  }

  patch<T>(key: string, value: Partial<T>): boolean {
    try {
      const currentValue = this.get<T>(key);
      if (currentValue) {
        const updatedValue = { ...currentValue, ...value };
        localStorage.setItem(key, JSON.stringify(updatedValue));
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Erro ao atualizar no localStorage para chave ${key}:`, error);
      return false;
    }
  }

  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erro ao remover do localStorage para chave ${key}:`, error);
      return false;
    }
  }

  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  }
}
