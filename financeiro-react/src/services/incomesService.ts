import type { Income, IncomeFormData } from '../types';
import { StorageService } from './storageService';
import { addMeses } from '../utils/date.util';

const STORAGE_KEY = 'incomes';

export class IncomesService {
  static getAll(): Income[] {
    return StorageService.get<Income[]>(STORAGE_KEY) || [];
  }

  static getById(id: string): Income | undefined {
    const incomes = this.getAll();
    return incomes.find(income => income.id === id);
  }

  static getByCategory(categoryId: string): Income[] {
    const incomes = this.getAll();
    return incomes.filter(income => income.categoryId === categoryId);
  }

  static getByType(typeId: string): Income[] {
    const incomes = this.getAll();
    return incomes.filter(income => income.typeId === typeId);
  }

  static getByMonth(monthYear: string): Income[] {
    const incomes = this.getAll();
    return incomes.filter(income => 
      income.datePrevista && income.datePrevista.startsWith(monthYear)
    );
  }

  static create(incomeData: IncomeFormData): Income[] {
    try {
      const incomes = this.getAll();
      const newIncomes: Income[] = [];

      if (incomeData.isMensal && incomeData.quantidadeMeses && incomeData.quantidadeMeses > 0) {
        // Criar receitas recorrentes
        const seriesId = this.generateId(); // ID único para a série
        
        for (let i = 0; i < incomeData.quantidadeMeses; i++) {
          const datePrevista = i === 0 
            ? incomeData.datePrevista 
            : addMeses(incomeData.datePrevista, i);
          
          // Data efetiva só é aplicada na primeira receita
          const dateEfetiva = incomeData.dateEfetiva && i === 0 
            ? incomeData.dateEfetiva 
            : undefined;

          const newIncome: Income = {
            id: this.generateId(),
            kind: 'Receita',
            categoryId: incomeData.categoryId,
            typeId: incomeData.typeId,
            value: incomeData.value,
            datePrevista,
            dateEfetiva,
            obs: incomeData.obs,
            isMensal: true,
            seriesId
          };

          newIncomes.push(newIncome);
        }
      } else {
        // Criar receita única
        const newIncome: Income = {
          id: this.generateId(),
          kind: 'Receita',
          categoryId: incomeData.categoryId,
          typeId: incomeData.typeId,
          value: incomeData.value,
          datePrevista: incomeData.datePrevista,
          dateEfetiva: incomeData.dateEfetiva,
          obs: incomeData.obs
        };

        newIncomes.push(newIncome);
      }

      // Adicionar todas as receitas ao array
      incomes.push(...newIncomes);
      
      if (StorageService.set(STORAGE_KEY, incomes)) {
        return newIncomes;
      }
      return [];
    } catch (error) {
      console.error('Erro ao criar receita(s):', error);
      return [];
    }
  }

  static update(id: string, updates: Partial<IncomeFormData>): Income | null {
    try {
      const incomes = this.getAll();
      const index = incomes.findIndex(income => income.id === id);
      
      if (index === -1) return null;
      
      // Atualizar apenas os campos permitidos
      const updatedIncome = { ...incomes[index] };
      
      if (updates.categoryId !== undefined) updatedIncome.categoryId = updates.categoryId;
      if (updates.typeId !== undefined) updatedIncome.typeId = updates.typeId;
      if (updates.value !== undefined) updatedIncome.value = updates.value;
      if (updates.datePrevista !== undefined) updatedIncome.datePrevista = updates.datePrevista;
      if (updates.dateEfetiva !== undefined) updatedIncome.dateEfetiva = updates.dateEfetiva;
      if (updates.obs !== undefined) updatedIncome.obs = updates.obs;
      
      incomes[index] = updatedIncome;
      
      if (StorageService.set(STORAGE_KEY, incomes)) {
        return updatedIncome;
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      return null;
    }
  }

  static delete(id: string): boolean {
    try {
      const incomes = this.getAll();
      const filteredIncomes = incomes.filter(income => income.id !== id);
      
      if (filteredIncomes.length === incomes.length) {
        return false; // Receita não encontrada
      }
      
      return StorageService.set(STORAGE_KEY, filteredIncomes);
    } catch (error) {
      console.error('Erro ao deletar receita:', error);
      return false;
    }
  }

  static deleteByCategory(categoryId: string): boolean {
    try {
      const incomes = this.getAll();
      const filteredIncomes = incomes.filter(income => income.categoryId !== categoryId);
      
      if (filteredIncomes.length === incomes.length) {
        return true; // Nenhuma receita encontrada para essa categoria
      }
      
      return StorageService.set(STORAGE_KEY, filteredIncomes);
    } catch (error) {
      console.error('Erro ao deletar receitas por categoria:', error);
      return false;
    }
  }

  static deleteByType(typeId: string): boolean {
    try {
      const incomes = this.getAll();
      const filteredIncomes = incomes.filter(income => income.typeId !== typeId);
      
      if (filteredIncomes.length === incomes.length) {
        return true; // Nenhuma receita encontrada para esse tipo
      }
      
      return StorageService.set(STORAGE_KEY, filteredIncomes);
    } catch (error) {
      console.error('Erro ao deletar receitas por tipo:', error);
      return false;
    }
  }

  static getBySeries(seriesId: string): Income[] {
    const incomes = this.getAll();
    return incomes.filter(income => income.seriesId === seriesId);
  }

  static deleteBySeries(seriesId: string): boolean {
    try {
      const incomes = this.getAll();
      const filteredIncomes = incomes.filter(income => income.seriesId !== seriesId);
      
      if (filteredIncomes.length === incomes.length) {
        return true; // Nenhuma receita encontrada para essa série
      }
      
      return StorageService.set(STORAGE_KEY, filteredIncomes);
    } catch (error) {
      console.error('Erro ao deletar receitas por série:', error);
      return false;
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
