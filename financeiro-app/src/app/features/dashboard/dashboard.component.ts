import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { Expense } from '../../models/expense.model';
import { Income } from '../../models/income.model';
import { Category } from '../../models/category.model';
import { Type } from '../../models/type.model';
import { ExpensesRepository } from '../../data/repositories/expenses.repository';
import { IncomesRepository } from '../../data/repositories/incomes.repository';
import { CategoriesRepository } from '../../data/repositories/categories.repository';
import { TypesRepository } from '../../data/repositories/types.repository';
import { DateUtil } from '../../shared/utils/date.util';
import { BrlPipe } from '../../shared/pipes/brl.pipe';
import { ExpenseDialogComponent } from '../../shared/components/expense-dialog/expense-dialog.component';
import { IncomeDialogComponent } from '../../shared/components/income-dialog/income-dialog.component';
import { EffectiveDialogComponent } from '../../shared/components/effective-dialog/effective-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

interface DashboardItem {
  id: string;
  type: 'expense' | 'income';
  description: string;
  amount: number;
  dateExpected: string;
  dateEffective?: string;
  categoryName: string;
  typeName: string;
  isOverdue: boolean;
  isPending: boolean;
  item: Expense | Income;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    BrlPipe
  ],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      
      <!-- Filtro de Mês Centralizado -->
      <div class="month-filter-container">
        <mat-form-field appearance="outline">
          <mat-label>Selecionar Mês</mat-label>
          <input matInput [matDatepicker]="monthPicker" 
                 [(ngModel)]="selectedMonth" 
                 (dateChange)="onMonthChange()"
                 placeholder="Selecione o mês">
          <mat-datepicker-toggle matSuffix [for]="monthPicker"></mat-datepicker-toggle>
          <mat-datepicker #monthPicker></mat-datepicker>
        </mat-form-field>
      </div>

      <!-- Cards de Resumo -->
      <div class="summary-cards">
        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Receitas</mat-card-title>
            <mat-icon class="card-icon" color="primary">trending_up</mat-icon>
          </mat-card-header>
          <mat-card-content>
            <div class="amount">{{ totalIncomes | brl }}</div>
            <div class="subtitle">{{ effectiveIncomesCount }} efetivadas</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Despesas</mat-card-title>
            <mat-icon class="card-icon" color="warn">trending_down</mat-icon>
          </mat-card-header>
          <mat-card-content>
            <div class="amount">{{ totalExpenses | brl }}</div>
            <div class="subtitle">{{ effectiveExpensesCount }} efetivadas</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Saldo</mat-card-title>
            <mat-icon class="card-icon">account_balance</mat-icon>
          </mat-card-header>
          <mat-card-content>
            <div class="amount" [class.positive]="balance >= 0" [class.negative]="balance < 0">
              {{ balance | brl }}
            </div>
            <div class="subtitle">Mês selecionado</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Lista de Lançamentos em Aberto -->
      <mat-card class="open-items-card">
        <mat-card-header>
          <mat-card-title>Lançamentos em Aberto</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="openItems.length === 0" class="no-items">
            <p>Nenhum lançamento em aberto para o mês selecionado.</p>
          </div>
          
          <div *ngIf="openItems.length > 0" class="open-items-list">
            <div *ngFor="let item of openItems" class="item-row">
              <div class="item-info">
                <div class="item-header">
                  <span class="item-type" [class.expense]="item.type === 'expense'" [class.income]="item.type === 'income'">
                    {{ item.type === 'expense' ? 'D' : 'R' }}
                  </span>
                  <span class="item-description">{{ item.description }}</span>
                  <span class="item-amount">{{ item.amount | brl }}</span>
                </div>
                <div class="item-meta">
                  <span class="category">{{ item.categoryName }}</span>
                  <span class="type">{{ item.typeName }}</span>
                  <span class="date">Prev: {{ item.dateExpected | date:'dd/MM/yyyy' }}</span>
                </div>
                <div class="item-status">
                  <mat-chip *ngIf="item.isOverdue" color="warn" class="status-chip">
                    ATRASADO
                  </mat-chip>
                  <mat-chip *ngIf="item.isPending" class="status-chip chip-amarelo">
                    PENDENTE
                  </mat-chip>
                </div>
              </div>
              
              <div class="item-actions">
                <button mat-icon-button color="primary" 
                        (click)="editItem(item)" 
                        aria-label="Editar lançamento">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="accent" 
                        *ngIf="isItemOpen(item)"
                        (click)="approveItem(item)" 
                        aria-label="Aprovar lançamento">
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-icon-button color="warn" 
                        (click)="deleteItem(item)" 
                        aria-label="Excluir lançamento">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    
    h1 {
      color: #1976d2;
      margin-bottom: 24px;
      text-align: center;
    }
    
    .month-filter-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 32px;
    }
    
    .month-filter-container mat-form-field {
      min-width: 250px;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    
    .summary-card {
      text-align: center;
    }
    
    .card-icon {
      font-size: 32px;
      height: 32px;
      width: 32px;
    }
    
    .amount {
      font-size: 32px;
      font-weight: bold;
      margin: 16px 0 8px 0;
    }
    
    .amount.positive {
      color: #4caf50;
    }
    
    .amount.negative {
      color: #f44336;
    }
    
    .subtitle {
      color: #666;
      font-size: 14px;
    }
    
    .open-items-card {
      margin-bottom: 20px;
    }
    
    .no-items {
      text-align: center;
      padding: 32px;
      color: #666;
    }
    
    .open-items-list {
      max-height: 600px;
      overflow-y: auto;
    }
    
    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .item-row:last-child {
      border-bottom: none;
    }
    
    .item-info {
      flex: 1;
    }
    
    .item-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    
    .item-type {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 12px;
      font-weight: bold;
      color: white;
    }
    
    .item-type.expense {
      background-color: #f44336;
    }
    
    .item-type.income {
      background-color: #4caf50;
    }
    
    .item-description {
      font-weight: 500;
      flex: 1;
    }
    
    .item-amount {
      font-weight: bold;
      color: #1976d2;
    }
    
    .item-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .category, .type, .date {
      background-color: #f0f0f0;
      padding: 2px 6px;
      border-radius: 4px;
    }
    
    .item-status {
      margin-bottom: 8px;
    }
    
    .status-chip {
      font-size: 12px;
      font-weight: bold;
    }
    
    .chip-amarelo {
      background-color: #F59E0B !important;
      color: #212121 !important;
    }
    
    .item-actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  selectedMonth: Date = new Date();
  
  totalIncomes = 0;
  totalExpenses = 0;
  balance = 0;
  effectiveIncomesCount = 0;
  effectiveExpensesCount = 0;
  
  openItems: DashboardItem[] = [];
  
  categories: Category[] = [];
  types: Type[] = [];

  constructor(
    private expensesRepo: ExpensesRepository,
    private incomesRepo: IncomesRepository,
    private categoriesRepo: CategoriesRepository,
    private typesRepo: TypesRepository,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.categories = this.categoriesRepo.getAll();
    this.types = this.typesRepo.getAll();
    this.updateDashboard();
  }

  onMonthChange() {
    this.updateDashboard();
  }

  private updateDashboard() {
    const year = this.selectedMonth.getFullYear();
    const month = this.selectedMonth.getMonth() + 1;
    
    // Calcular totais efetivados
    const effectiveIncomes = this.incomesRepo.getEffectiveIncomesByMonth(year, month);
    const effectiveExpenses = this.expensesRepo.getEffectiveExpensesByMonth(year, month);
    
    this.totalIncomes = effectiveIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    this.totalExpenses = effectiveExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    this.balance = this.totalIncomes - this.totalExpenses;
    
    this.effectiveIncomesCount = effectiveIncomes.length;
    this.effectiveExpensesCount = effectiveExpenses.length;
    
    // Carregar itens em aberto
    this.loadOpenItems(year, month);
  }

  private loadOpenItems(year: number, month: number) {
    const openExpenses = this.expensesRepo.getOpenExpenses();
    const openIncomes = this.incomesRepo.getOpenIncomes();
    
    // Filtrar por mês selecionado
    const monthExpenses = openExpenses.filter(exp => 
      DateUtil.isInMonth(exp.dateExpected, year, month)
    );
    const monthIncomes = openIncomes.filter(inc => 
      DateUtil.isInMonth(inc.dateExpected, year, month)
    );
    
    this.openItems = [
      ...monthExpenses.map(exp => this.createDashboardItem(exp, 'expense')),
      ...monthIncomes.map(inc => this.createDashboardItem(inc, 'income'))
    ];
    
    // Ordenar por data prevista (mais antigas primeiro)
    this.openItems.sort((a, b) => 
      new Date(a.dateExpected).getTime() - new Date(b.dateExpected).getTime()
    );
  }

  private createDashboardItem(
    item: Expense | Income, 
    type: 'expense' | 'income'
  ): DashboardItem {
    const category = this.categories.find(cat => cat.id === item.categoryId);
    const typeItem = this.types.find(t => t.id === item.typeId);
    const isOverdue = !item.dateEffective && DateUtil.isPast(item.dateExpected);
    const isPending = !item.dateEffective && DateUtil.isTodayOrFuture(item.dateExpected);

    return {
      id: item.id,
      type,
      description: item.description,
      amount: item.amount,
      dateExpected: item.dateExpected,
      dateEffective: item.dateEffective,
      categoryName: category?.name || 'N/A',
      typeName: typeItem?.name || 'N/A',
      isOverdue,
      isPending,
      item
    };
  }

  editItem(dashboardItem: DashboardItem) {
    const categories = this.categories;
    const types = this.types;

    if (dashboardItem.type === 'expense') {
      const dialogRef = this.dialog.open(ExpenseDialogComponent, {
        data: {
          expense: dashboardItem.item as Expense,
          categories,
          types,
          isEdit: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const updated = this.expensesRepo.update(dashboardItem.id, result);
          if (updated) {
            this.snackBar.open('Despesa atualizada com sucesso!', 'Fechar', { duration: 3000 });
            this.updateDashboard();
          } else {
            this.snackBar.open('Erro ao atualizar despesa', 'Fechar', { duration: 3000 });
          }
        }
      });
    } else {
      const dialogRef = this.dialog.open(IncomeDialogComponent, {
        data: {
          income: dashboardItem.item as Income,
          categories,
          types,
          isEdit: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const updated = this.incomesRepo.update(dashboardItem.id, result);
          if (updated) {
            this.snackBar.open('Receita atualizada com sucesso!', 'Fechar', { duration: 3000 });
            this.updateDashboard();
          } else {
            this.snackBar.open('Erro ao atualizar receita', 'Fechar', { duration: 3000 });
          }
        }
      });
    }
  }

  approveItem(dashboardItem: DashboardItem) {
    const dialogRef = this.dialog.open(EffectiveDialogComponent, {
      data: {
        title: `Aprovar ${dashboardItem.type === 'expense' ? 'Despesa' : 'Receita'}`,
        description: dashboardItem.description,
        amount: dashboardItem.amount
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let updated: any;
        
        if (dashboardItem.type === 'expense') {
          updated = this.expensesRepo.update(dashboardItem.id, {
            amount: result.amountEffective,
            dateEffective: result.dateEffective,
            observation: result.observation
          });
        } else {
          updated = this.incomesRepo.update(dashboardItem.id, {
            amount: result.amountEffective,
            dateEffective: result.dateEffective,
            observation: result.observation
          });
        }
        
        if (updated) {
          this.snackBar.open(`${dashboardItem.type === 'expense' ? 'Despesa' : 'Receita'} aprovada com sucesso!`, 'Fechar', { duration: 3000 });
          this.loadData();
        } else {
          this.snackBar.open(`Erro ao aprovar ${dashboardItem.type === 'expense' ? 'despesa' : 'receita'}`, 'Fechar', { duration: 3000 });
        }
      }
    });
  }

  deleteItem(dashboardItem: DashboardItem) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o ${dashboardItem.type === 'expense' ? 'despesa' : 'receita'} "${dashboardItem.description}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let deleted = false;
        
        if (dashboardItem.type === 'expense') {
          deleted = this.expensesRepo.delete(dashboardItem.id);
        } else {
          deleted = this.incomesRepo.delete(dashboardItem.id);
        }

        if (deleted) {
          this.snackBar.open('Lançamento excluído com sucesso!', 'Fechar', { duration: 3000 });
          this.updateDashboard();
        } else {
          this.snackBar.open('Erro ao excluir lançamento', 'Fechar', { duration: 3000 });
        }
      }
    });
  }

  isItemOpen(item: DashboardItem): boolean {
    // Verificar se o item está em aberto (sem data efetiva)
    const hasEffectiveDate = item.dateEffective && 
                            item.dateEffective !== '' && 
                            item.dateEffective !== '-' &&
                            item.dateEffective !== 'null' &&
                            item.dateEffective !== 'undefined';
    
    return !hasEffectiveDate;
  }
}
