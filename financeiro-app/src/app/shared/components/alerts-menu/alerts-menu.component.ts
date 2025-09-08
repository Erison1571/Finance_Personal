import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Expense } from '../../../models/expense.model';
import { Income } from '../../../models/income.model';
import { Category } from '../../../models/category.model';
import { Type } from '../../../models/type.model';
import { ExpensesRepository } from '../../../data/repositories/expenses.repository';
import { IncomesRepository } from '../../../data/repositories/incomes.repository';
import { CategoriesRepository } from '../../../data/repositories/categories.repository';
import { TypesRepository } from '../../../data/repositories/types.repository';
import { DateUtil } from '../../utils/date.util';
import { BrlPipe } from '../../pipes/brl.pipe';
import { EffectiveDialogComponent } from '../effective-dialog/effective-dialog.component';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { IncomeDialogComponent } from '../income-dialog/income-dialog.component';

interface AlertItem {
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
  observation?: string;
  item: Expense | Income;
}

@Component({
  selector: 'app-alerts-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatChipsModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule,
    BrlPipe
  ],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="alertsMenu" 
            [matBadge]="openCount" 
            matBadgeColor="warn"
            aria-label="Abrir menu de alertas">
      <mat-icon>notifications</mat-icon>
    </button>

    <mat-menu #alertsMenu="matMenu" class="alerts-menu">
      <div class="alerts-header">
        <h3>Alertas de Lançamentos</h3>
        <p>{{ openCount }} lançamento(s) em aberto</p>
      </div>

      <mat-divider></mat-divider>

      <div class="alerts-content" *ngIf="alertItems.length > 0; else noAlerts">
        <mat-list>
          <mat-list-item *ngFor="let alert of alertItems" class="alert-item">
            <div class="alert-content">
              <div class="alert-header">
                <mat-chip [color]="alert.isOverdue ? 'warn' : 'accent'" class="alert-chip">
                  {{ alert.isOverdue ? 'ATRASADO' : 'PENDENTE' }}
                </mat-chip>
                <span class="alert-amount">{{ alert.amount | brl }}</span>
              </div>
              
              <div class="alert-details">
                <div class="alert-description">{{ alert.description }}</div>
                <div class="alert-meta">
                  <span class="category">{{ alert.categoryName }}</span>
                  <span class="type">{{ alert.typeName }}</span>
                  <span class="date">Prev: {{ alert.dateExpected | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>

              <div class="alert-actions">
                <button mat-button color="primary" size="small" 
                        (click)="editItem(alert)" 
                        aria-label="Editar lançamento">
                  Editar
                </button>
                <button mat-button color="accent" size="small" 
                        *ngIf="isItemOpen(alert)"
                        (click)="approveItem(alert)" 
                        aria-label="Aprovar lançamento">
                  Aprovar
                </button>
              </div>
            </div>
          </mat-list-item>
        </mat-list>
      </div>

      <ng-template #noAlerts>
        <div class="no-alerts">
          <p>Nenhum lançamento em aberto</p>
        </div>
      </ng-template>
    </mat-menu>
  `,
  styles: [`
    .alerts-menu {
      max-width: 500px;
      max-height: 600px;
    }

    .alerts-header {
      padding: 16px;
      background-color: #f5f5f5;
    }

    .alerts-header h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .alerts-header p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .alerts-content {
      max-height: 400px;
      overflow-y: auto;
    }

    .alert-item {
      height: auto;
      padding: 16px;
    }

    .alert-content {
      width: 100%;
    }

    .alert-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .alert-chip {
      font-size: 12px;
      font-weight: bold;
    }

    .alert-amount {
      font-weight: bold;
      color: #1976d2;
    }

    .alert-details {
      margin-bottom: 12px;
    }

    .alert-description {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .alert-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #666;
    }

    .alert-actions {
      display: flex;
      gap: 8px;
    }

    .no-alerts {
      padding: 32px;
      text-align: center;
      color: #666;
    }

    .category, .type, .date {
      background-color: #f0f0f0;
      padding: 2px 6px;
      border-radius: 4px;
    }
  `]
})
export class AlertsMenuComponent implements OnInit {
  alertItems: AlertItem[] = [];
  openCount = 0;

  constructor(
    private expensesRepo: ExpensesRepository,
    private incomesRepo: IncomesRepository,
    private categoriesRepo: CategoriesRepository,
    private typesRepo: TypesRepository,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    const openExpenses = this.expensesRepo.getOpenExpenses();
    const openIncomes = this.incomesRepo.getOpenIncomes();
    const categories = this.categoriesRepo.getAll();
    const types = this.typesRepo.getAll();

    this.alertItems = [
      ...openExpenses.map(exp => this.createAlertItem(exp, 'expense', categories, types)),
      ...openIncomes.map(inc => this.createAlertItem(inc, 'income', categories, types))
    ];

    // Ordenar por data prevista (mais antigas primeiro)
    this.alertItems.sort((a, b) => new Date(a.dateExpected).getTime() - new Date(b.dateExpected).getTime());

    this.openCount = this.alertItems.length;
  }

  private createAlertItem(item: Expense | Income, type: 'expense' | 'income', categories: Category[], types: Type[]): AlertItem {
    const category = categories.find(cat => cat.id === item.categoryId);
    const typeObj = types.find(t => t.id === item.typeId);
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
      typeName: typeObj?.name || 'N/A',
      observation: item.observation,
      isOverdue,
      isPending,
      item
    };
  }

  // Função helper para verificar se um item está em aberto
  isItemOpen(alert: AlertItem): boolean {
    // Verificar se o item está em aberto (sem data efetiva)
    const hasEffectiveDate = alert.dateEffective && 
                            alert.dateEffective !== '' && 
                            alert.dateEffective !== '-' &&
                            alert.dateEffective !== 'null' &&
                            alert.dateEffective !== 'undefined';
    
    return !hasEffectiveDate;
  }

  editItem(alert: AlertItem) {
    const categories = this.categoriesRepo.getAll();
    const types = this.typesRepo.getAll();

    if (alert.type === 'expense') {
      const dialogRef = this.dialog.open(ExpenseDialogComponent, {
        data: {
          expense: alert.item as Expense,
          categories,
          types,
          isEdit: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const updated = this.expensesRepo.update(alert.id, result);
          if (updated) {
            this.snackBar.open('Despesa atualizada com sucesso!', 'Fechar', { duration: 3000 });
            this.loadAlerts();
          } else {
            this.snackBar.open('Erro ao atualizar despesa', 'Fechar', { duration: 3000 });
          }
        }
      });
    } else {
      const dialogRef = this.dialog.open(IncomeDialogComponent, {
        data: {
          income: alert.item as Income,
          categories,
          types,
          isEdit: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const updated = this.incomesRepo.update(alert.id, result);
          if (updated) {
            this.snackBar.open('Receita atualizada com sucesso!', 'Fechar', { duration: 3000 });
            this.loadAlerts();
          } else {
            this.snackBar.open('Erro ao atualizar receita', 'Fechar', { duration: 3000 });
          }
        }
      });
    }
  }

  approveItem(alert: AlertItem) {
    const dialogRef = this.dialog.open(EffectiveDialogComponent, {
      data: {
        title: `Aprovar ${alert.type === 'expense' ? 'Despesa' : 'Receita'}`,
        description: alert.description,
        amount: alert.amount
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let updated: any;
        
        if (alert.type === 'expense') {
          updated = this.expensesRepo.update(alert.id, {
            amount: result.amountEffective,
            dateEffective: result.dateEffective,
            observation: result.observation
          });
        } else {
          updated = this.incomesRepo.update(alert.id, {
            amount: result.amountEffective,
            dateEffective: result.dateEffective,
            observation: result.observation
          });
        }

        if (updated) {
          this.snackBar.open('Lançamento aprovado com sucesso!', 'Fechar', { duration: 3000 });
          this.loadAlerts();
        } else {
          this.snackBar.open('Erro ao aprovar lançamento', 'Fechar', { duration: 3000 });
        }
      }
    });
  }
}
