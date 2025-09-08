import type { Expense, ExpenseFormData } from '../types';
import { StorageService } from './storageService';
import { addMeses } from '../utils/date.util';

const STORAGE_KEY = 'expenses';

export class ExpensesService {
  static getAll(): Expense[] {
    return StorageService.get<Expense[]>(STORAGE_KEY) || [];
  }

  static getById(id: string): Expense | undefined {
    const expenses = this.getAll();
    return expenses.find(expense => expense.id === id);
  }

  static getByCategory(categoryId: string): Expense[] {
    const expenses = this.getAll();
    return expenses.filter(expense => expense.categoryId === categoryId);
  }

  static getByType(typeId: string): Expense[] {
    const expenses = this.getAll();
    return expenses.filter(expense => expense.typeId === typeId);
  }

  static getByMonth(monthYear: string): Expense[] {
    const expenses = this.getAll();
    return expenses.filter(expense => 
      expense.datePrevista && expense.datePrevista.startsWith(monthYear)
    );
  }

  static create(expenseData: ExpenseFormData): Expense[] {
    try {
      const expenses = this.getAll();
      const newExpenses: Expense[] = [];

      if (expenseData.isMensal && expenseData.quantidadeMeses && expenseData.quantidadeMeses > 0) {
        // Criar despesas recorrentes
        const seriesId = this.generateId(); // ID único para a série
        
        for (let i = 0; i < expenseData.quantidadeMeses; i++) {
          const datePrevista = i === 0 
            ? expenseData.datePrevista 
            : addMeses(expenseData.datePrevista, i);
          
          // Data efetiva só é replicada se for uma despesa recorrente
          // Para despesas únicas, apenas a primeira tem data efetiva
          const dateEfetiva = expenseData.dateEfetiva && i === 0 
            ? expenseData.dateEfetiva 
            : undefined;

          const newExpense: Expense = {
            id: this.generateId(),
            kind: 'Despesa',
            categoryId: expenseData.categoryId,
            typeId: expenseData.typeId,
            value: expenseData.value,
            datePrevista,
            dateEfetiva,
            obs: expenseData.obs,
            isMensal: true,
            seriesId
          };

          newExpenses.push(newExpense);
        }
      } else {
        // Criar despesa única
        const newExpense: Expense = {
          id: this.generateId(),
          kind: 'Despesa',
          categoryId: expenseData.categoryId,
          typeId: expenseData.typeId,
          value: expenseData.value,
          datePrevista: expenseData.datePrevista,
          dateEfetiva: expenseData.dateEfetiva,
          obs: expenseData.obs
        };

        newExpenses.push(newExpense);
      }

      // Adicionar todas as despesas ao array
      expenses.push(...newExpenses);
      
      if (StorageService.set(STORAGE_KEY, expenses)) {
        return newExpenses;
      }
      return [];
    } catch (error) {
      console.error('Erro ao criar despesa(s):', error);
      return [];
    }
  }

  static update(id: string, updates: Partial<ExpenseFormData>): Expense | null {
    try {
      const expenses = this.getAll();
      const index = expenses.findIndex(expense => expense.id === id);
      
      if (index === -1) return null;
      
      // Atualizar apenas os campos permitidos
      const updatedExpense = { ...expenses[index] };
      
      if (updates.categoryId !== undefined) updatedExpense.categoryId = updates.categoryId;
      if (updates.typeId !== undefined) updatedExpense.typeId = updates.typeId;
      if (updates.value !== undefined) updatedExpense.value = updates.value;
      if (updates.datePrevista !== undefined) updatedExpense.datePrevista = updates.datePrevista;
      if (updates.dateEfetiva !== undefined) updatedExpense.dateEfetiva = updates.dateEfetiva;
      if (updates.obs !== undefined) updatedExpense.obs = updates.obs;
      
      expenses[index] = updatedExpense;
      
      if (StorageService.set(STORAGE_KEY, expenses)) {
        return updatedExpense;
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      return null;
    }
  }

  static delete(id: string): boolean {
    try {
      const expenses = this.getAll();
      const filteredExpenses = expenses.filter(expense => expense.id !== id);
      
      if (filteredExpenses.length === expenses.length) {
        return false; // Despesa não encontrada
      }
      
      return StorageService.set(STORAGE_KEY, filteredExpenses);
    } catch (error) {
      console.error('Erro ao deletar despesa:', error);
      return false;
    }
  }

  static deleteByCategory(categoryId: string): boolean {
    try {
      const expenses = this.getAll();
      const filteredExpenses = expenses.filter(expense => expense.categoryId !== categoryId);
      
      if (filteredExpenses.length === expenses.length) {
        return true; // Nenhuma despesa encontrada para essa categoria
      }
      
      return StorageService.set(STORAGE_KEY, filteredExpenses);
    } catch (error) {
      console.error('Erro ao deletar despesas por categoria:', error);
      return false;
    }
  }

  static deleteByType(typeId: string): boolean {
    try {
      const expenses = this.getAll();
      const filteredExpenses = expenses.filter(expense => expense.typeId !== typeId);
      
      if (filteredExpenses.length === expenses.length) {
        return true; // Nenhuma despesa encontrada para esse tipo
      }
      
      return StorageService.set(STORAGE_KEY, filteredExpenses);
    } catch (error) {
      console.error('Erro ao deletar despesas por tipo:', error);
      return false;
    }
  }

  static getBySeries(seriesId: string): Expense[] {
    const expenses = this.getAll();
    return expenses.filter(expense => expense.seriesId === seriesId);
  }

  static deleteBySeries(seriesId: string): boolean {
    try {
      const expenses = this.getAll();
      const filteredExpenses = expenses.filter(expense => expense.seriesId !== seriesId);
      
      if (filteredExpenses.length === expenses.length) {
        return true; // Nenhuma despesa encontrada para essa série
      }
      
      return StorageService.set(STORAGE_KEY, filteredExpenses);
    } catch (error) {
      console.error('Erro ao deletar despesas por série:', error);
      return false;
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
