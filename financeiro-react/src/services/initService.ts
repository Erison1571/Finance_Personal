import type { Kind } from '../types';
import { CategoriesService } from './categoriesService';
import { TypesService } from './typesService';
import { ExpensesService } from './expensesService';
import { IncomesService } from './incomesService';
import { StorageService } from './storageService';

export class InitService {
  static initializeSampleData(): void {
    // Verificar se já existem dados
    if (StorageService.get('categories') || 
        StorageService.get('types') ||
        StorageService.get('expenses') ||
        StorageService.get('incomes')) {
      return; // Já existem dados, não inicializar
    }
    
    this.initializeCategories();
    this.initializeTypes();
    this.initializeExpenses();
    this.initializeIncomes();
  }

  static resetAllData(): void {
    // Limpar todos os dados
    StorageService.remove('categories');
    StorageService.remove('types');
    StorageService.remove('expenses');
    StorageService.remove('incomes');
    
    // Recriar dados de exemplo
    this.initializeCategories();
    this.initializeTypes();
    this.initializeExpenses();
    this.initializeIncomes();
  }

  private static initializeCategories(): void {
    const categories = [
      { name: 'Moradia', color: '#f44336', kind: 'Despesa' as Kind },
      { name: 'Transporte', color: '#ff9800', kind: 'Despesa' as Kind },
      { name: 'Alimentação', color: '#4caf50', kind: 'Despesa' as Kind },
      { name: 'Saúde', color: '#2196f3', kind: 'Despesa' as Kind },
      { name: 'Educação', color: '#9c27b0', kind: 'Despesa' as Kind },
      { name: 'Lazer', color: '#e91e63', kind: 'Despesa' as Kind },
      { name: 'Salário', color: '#4caf50', kind: 'Receita' as Kind },
      { name: 'Freelance', color: '#ff9800', kind: 'Receita' as Kind },
      { name: 'Investimentos', color: '#2196f3', kind: 'Receita' as Kind },
      { name: 'Outros', color: '#607d8b', kind: 'Receita' as Kind }
    ];

    categories.forEach(category => {
      CategoriesService.create(category);
    });
  }

  private static initializeTypes(): void {
    const types = [
      { name: 'Fixo', kind: 'Despesa' as Kind, categoryId: '1' },
      { name: 'Variável', kind: 'Despesa' as Kind, categoryId: '1' },
      { name: 'Combustível', kind: 'Despesa' as Kind, categoryId: '2' },
      { name: 'Manutenção', kind: 'Despesa' as Kind, categoryId: '2' },
      { name: 'Supermercado', kind: 'Despesa' as Kind, categoryId: '3' },
      { name: 'Restaurante', kind: 'Despesa' as Kind, categoryId: '3' },
      { name: 'Consulta', kind: 'Despesa' as Kind, categoryId: '4' },
      { name: 'Medicamento', kind: 'Despesa' as Kind, categoryId: '4' },
      { name: 'Mensalidade', kind: 'Despesa' as Kind, categoryId: '5' },
      { name: 'Material', kind: 'Despesa' as Kind, categoryId: '5' },
      { name: 'Entretenimento', kind: 'Despesa' as Kind, categoryId: '6' },
      { name: 'Viagem', kind: 'Despesa' as Kind, categoryId: '6' },
      { name: 'CLT', kind: 'Receita' as Kind, categoryId: '7' },
      { name: 'PJ', kind: 'Receita' as Kind, categoryId: '7' },
      { name: 'Projeto', kind: 'Receita' as Kind, categoryId: '8' },
      { name: 'Consultoria', kind: 'Receita' as Kind, categoryId: '8' },
      { name: 'Renda Fixa', kind: 'Receita' as Kind, categoryId: '9' },
      { name: 'Renda Variável', kind: 'Receita' as Kind, categoryId: '9' },
      { name: 'Bônus', kind: 'Receita' as Kind, categoryId: '10' },
      { name: 'Presente', kind: 'Receita' as Kind, categoryId: '10' }
    ];

    types.forEach(type => {
      TypesService.create(type);
    });
  }

  private static initializeExpenses(): void {
    const expenses = [
      {
        categoryId: '1',
        typeId: '1',
        value: 120000,
        datePrevista: '2024-08-01',
        dateEfetiva: '2024-08-01',
        obs: 'Aluguel mensal',
        isMensal: false
      },
      {
        categoryId: '2',
        typeId: '3',
        value: 25000,
        datePrevista: '2024-08-15',
        dateEfetiva: '2024-08-15',
        obs: 'Recarga de Cartão Cidadão',
        isMensal: false
      },
      {
        categoryId: '2',
        typeId: '4',
        value: 15000,
        datePrevista: '2024-08-20',
        dateEfetiva: '',
        obs: 'Troca de óleo',
        isMensal: false
      },
      {
        categoryId: '3',
        typeId: '5',
        value: 80000,
        datePrevista: '2024-08-05',
        dateEfetiva: '2024-08-05',
        obs: 'Supermercado',
        isMensal: false
      },
      {
        categoryId: '4',
        typeId: '7',
        value: 15000,
        datePrevista: '2024-08-10',
        dateEfetiva: '',
        obs: 'Consulta médica',
        isMensal: false
      }
    ];

    expenses.forEach(expense => {
      ExpensesService.create(expense);
    });
  }

  private static initializeIncomes(): void {
    const incomes = [
      {
        categoryId: '7',
        typeId: '13',
        value: 500000,
        datePrevista: '2024-08-05',
        dateEfetiva: '2024-08-05',
        obs: 'Salário agosto',
        isMensal: false
      },
      {
        categoryId: '8',
        typeId: '15',
        value: 150000,
        datePrevista: '2024-08-20',
        dateEfetiva: '',
        obs: 'Projeto website',
        isMensal: false
      },
      {
        categoryId: '9',
        typeId: '17',
        value: 5000,
        datePrevista: '2024-08-01',
        dateEfetiva: '2024-08-01',
        obs: 'Dividendos',
        isMensal: false
      }
    ];

    incomes.forEach(income => {
      IncomesService.create(income);
    });
  }
}
