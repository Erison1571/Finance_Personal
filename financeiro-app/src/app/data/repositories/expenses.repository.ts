import { Injectable } from '@angular/core';
import { Expense } from '../../models/expense.model';
import { StorageService } from '../../core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesRepository {
  private readonly STORAGE_KEY = 'expenses';

  constructor(private storageService: StorageService) { }

  getAll(): Expense[] {
    return this.storageService.get<Expense[]>(this.STORAGE_KEY) || [];
  }

  getById(id: string): Expense | undefined {
    const expenses = this.getAll();
    return expenses.find(exp => exp.id === id);
  }

  getByMonth(year: number, month: number): Expense[] {
    const expenses = this.getAll();
    return expenses.filter(exp => {
      const date = new Date(exp.dateExpected);
      return date.getFullYear() === year && date.getMonth() === month - 1;
    });
  }

  getOpenExpenses(): Expense[] {
    const expenses = this.getAll();
    return expenses.filter(exp => !exp.dateEffective);
  }

  getEffectiveExpensesByMonth(year: number, month: number): Expense[] {
    const expenses = this.getAll();
    return expenses.filter(exp => {
      if (!exp.dateEffective) return false;
      const date = new Date(exp.dateEffective);
      return date.getFullYear() === year && date.getMonth() === month - 1;
    });
  }

  create(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Expense | null {
    try {
      const expenses = this.getAll();
      const now = new Date().toISOString();
      const newExpense: Expense = {
        ...expense,
        id: this.generateId(),
        createdAt: now,
        updatedAt: now
      };
      
      expenses.push(newExpense);
      
      if (this.storageService.set(this.STORAGE_KEY, expenses)) {
        return newExpense;
      }
      return null;
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      return null;
    }
  }

  update(id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>): Expense | null {
    try {
      const expenses = this.getAll();
      const index = expenses.findIndex(exp => exp.id === id);
      
      if (index === -1) return null;
      
      expenses[index] = { 
        ...expenses[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      
      if (this.storageService.set(this.STORAGE_KEY, expenses)) {
        return expenses[index];
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      return null;
    }
  }

  delete(id: string): boolean {
    try {
      const expenses = this.getAll();
      const filteredExpenses = expenses.filter(exp => exp.id !== id);
      
      if (filteredExpenses.length === expenses.length) {
        return false; // Despesa não encontrada
      }
      
      return this.storageService.set(this.STORAGE_KEY, filteredExpenses);
    } catch (error) {
      console.error('Erro ao deletar despesa:', error);
      return false;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
