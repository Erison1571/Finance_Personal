import { Injectable } from '@angular/core';
import { CategoriesRepository } from '../../data/repositories/categories.repository';
import { TypesRepository } from '../../data/repositories/types.repository';
import { ExpensesRepository } from '../../data/repositories/expenses.repository';
import { IncomesRepository } from '../../data/repositories/incomes.repository';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(
    private categoriesRepo: CategoriesRepository,
    private typesRepo: TypesRepository,
    private expensesRepo: ExpensesRepository,
    private incomesRepo: IncomesRepository
  ) {}

  initializeSampleData() {
    this.initializeCategories();
    this.initializeTypes();
    this.initializeExpenses();
    this.initializeIncomes();
  }

  private initializeCategories() {
    const existingCategories = this.categoriesRepo.getAll();
    if (existingCategories.length === 0) {
      const now = new Date().toISOString();
      
      this.categoriesRepo.create({
        name: 'Moradia',
        kind: 'Despesa',
        createdAt: now,
        updatedAt: now
      });

      this.categoriesRepo.create({
        name: 'Transporte',
        kind: 'Despesa',
        createdAt: now,
        updatedAt: now
      });

      this.categoriesRepo.create({
        name: 'Alimentação',
        kind: 'Despesa',
        createdAt: now,
        updatedAt: now
      });

      this.categoriesRepo.create({
        name: 'Salário',
        kind: 'Receita',
        createdAt: now,
        updatedAt: now
      });

      this.categoriesRepo.create({
        name: 'Freelance',
        kind: 'Receita',
        createdAt: now,
        updatedAt: now
      });
    }
  }

  private initializeTypes() {
    const existingTypes = this.typesRepo.getAll();
    if (existingTypes.length === 0) {
      
      this.typesRepo.create({
        name: 'Aluguel'
      });

      this.typesRepo.create({
        name: 'Cartão Cidadão (Passagem)'
      });

      this.typesRepo.create({
        name: 'Internet e Telefone Fixo'
      });

      this.typesRepo.create({
        name: 'Supermercado'
      });

      this.typesRepo.create({
        name: 'Restaurante'
      });

      this.typesRepo.create({
        name: 'Salário Mensal'
      });

      this.typesRepo.create({
        name: 'Projeto Freelance'
      });
    }
  }

  private initializeExpenses() {
    const existingExpenses = this.expensesRepo.getAll();
    if (existingExpenses.length === 0) {
      const now = new Date().toISOString();
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 10);
      
      // Despesa efetivada (com data efetiva)
      this.expensesRepo.create({
        description: 'Aluguel mensal',
        amount: 1000.00,
        dateExpected: '2025-08-10',
        dateEffective: '2025-08-06',
        categoryId: this.getCategoryIdByName('Moradia'),
        typeId: this.getTypeIdByName('Aluguel'),
        observation: 'Aluguel mensal'
      });

      // Despesa efetivada
      this.expensesRepo.create({
        description: 'Recarga de Cartão Cidadão',
        amount: 252.00,
        dateExpected: '2025-08-10',
        dateEffective: '2025-08-06',
        categoryId: this.getCategoryIdByName('Transporte'),
        typeId: this.getTypeIdByName('Cartão Cidadão (Passagem)'),
        observation: 'Recarga de Cartão Cidadão'
      });

      // Despesa pendente (sem data efetiva)
      this.expensesRepo.create({
        description: 'Internet e Telefone',
        amount: 100.00,
        dateExpected: '2025-08-10',
        categoryId: this.getCategoryIdByName('Moradia'),
        typeId: this.getTypeIdByName('Internet e Telefone Fixo'),
        observation: ''
      });

      // Despesa pendente para próximo mês
      this.expensesRepo.create({
        description: 'Supermercado',
        amount: 350.00,
        dateExpected: nextMonth.toISOString().split('T')[0],
        categoryId: this.getCategoryIdByName('Alimentação'),
        typeId: this.getTypeIdByName('Supermercado'),
        observation: 'Compras mensais'
      });
    }
  }

  private initializeIncomes() {
    const existingIncomes = this.incomesRepo.getAll();
    if (existingIncomes.length === 0) {
      const now = new Date().toISOString();
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 5);
      
      // Receita efetivada
      this.incomesRepo.create({
        description: 'Salário agosto',
        amount: 3000.00,
        dateExpected: '2025-08-05',
        dateEffective: '2025-08-05',
        categoryId: this.getCategoryIdByName('Salário'),
        typeId: this.getTypeIdByName('Salário Mensal'),
        observation: 'Salário mensal'
      });

      // Receita pendente
      this.incomesRepo.create({
        description: 'Projeto website',
        amount: 800.00,
        dateExpected: nextMonth.toISOString().split('T')[0],
        categoryId: this.getCategoryIdByName('Freelance'),
        typeId: this.getTypeIdByName('Projeto Freelance'),
        observation: 'Desenvolvimento de website'
      });
    }
  }

  private getCategoryIdByName(name: string): string {
    const category = this.categoriesRepo.getAll().find(cat => cat.name === name);
    return category?.id || '';
  }

  private getTypeIdByName(name: string): string {
    const type = this.typesRepo.getAll().find(t => t.name === name);
    return type?.id || '';
  }
}
