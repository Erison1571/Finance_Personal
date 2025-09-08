import { Injectable } from '@angular/core';
import { Income } from '../../models/income.model';
import { StorageService } from '../../core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class IncomesRepository {
  private readonly STORAGE_KEY = 'incomes';

  constructor(private storageService: StorageService) { }

  getAll(): Income[] {
    return this.storageService.get<Income[]>(this.STORAGE_KEY) || [];
  }

  getById(id: string): Income | undefined {
    const incomes = this.getAll();
    return incomes.find(inc => inc.id === id);
  }

  getByMonth(year: number, month: number): Income[] {
    const incomes = this.getAll();
    return incomes.filter(inc => {
      const date = new Date(inc.dateExpected);
      return date.getFullYear() === year && date.getMonth() === month - 1;
    });
  }

  getOpenIncomes(): Income[] {
    const incomes = this.getAll();
    return incomes.filter(inc => !inc.dateEffective);
  }

  getEffectiveIncomesByMonth(year: number, month: number): Income[] {
    const incomes = this.getAll();
    return incomes.filter(inc => {
      if (!inc.dateEffective) return false;
      const date = new Date(inc.dateEffective);
      return date.getFullYear() === year && date.getMonth() === month - 1;
    });
  }

  create(income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>): Income | null {
    try {
      const incomes = this.getAll();
      const now = new Date().toISOString();
      const newIncome: Income = {
        ...income,
        id: this.generateId(),
        createdAt: now,
        updatedAt: now
      };
      
      incomes.push(newIncome);
      
      if (this.storageService.set(this.STORAGE_KEY, incomes)) {
        return newIncome;
      }
      return null;
    } catch (error) {
      console.error('Erro ao criar receita:', error);
      return null;
    }
  }

  update(id: string, updates: Partial<Omit<Income, 'id' | 'createdAt'>>): Income | null {
    try {
      const incomes = this.getAll();
      const index = incomes.findIndex(inc => inc.id === id);
      
      if (index === -1) return null;
      
      incomes[index] = { 
        ...incomes[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      
      if (this.storageService.set(this.STORAGE_KEY, incomes)) {
        return incomes[index];
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      return null;
    }
  }

  delete(id: string): boolean {
    try {
      const incomes = this.getAll();
      const filteredIncomes = incomes.filter(inc => inc.id !== id);
      
      if (filteredIncomes.length === incomes.length) {
        return false; // Receita não encontrada
      }
      
      return this.storageService.set(this.STORAGE_KEY, filteredIncomes);
    } catch (error) {
      console.error('Erro ao deletar receita:', error);
      return false;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
