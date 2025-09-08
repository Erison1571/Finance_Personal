import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { Income } from '../../models/income.model';
import { Category } from '../../models/category.model';
import { Type } from '../../models/type.model';
import { IncomesRepository } from '../../data/repositories/incomes.repository';
import { CategoriesRepository } from '../../data/repositories/categories.repository';
import { TypesRepository } from '../../data/repositories/types.repository';
import { DateUtil } from '../../shared/utils/date.util';
import { BrlPipe } from '../../shared/pipes/brl.pipe';
import { IncomeDialogComponent } from '../../shared/components/income-dialog/income-dialog.component';
import { EffectiveDialogComponent } from '../../shared/components/effective-dialog/effective-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

interface IncomeRow {
  id: string;
  description: string;
  amount: number;
  dateExpected: string;
  dateEffective?: string;
  categoryName: string;
  typeName: string;
  observation?: string;
  isOverdue: boolean;
  isPending: boolean;
  income: Income;
}

@Component({
  selector: 'app-receitas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    BrlPipe
  ],
  template: `
    <div class="receitas-container">
      <div class="header">
        <h1>Receitas</h1>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nova Receita
        </button>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Categoria</mat-label>
          <mat-select [(ngModel)]="selectedCategory" (selectionChange)="applyFilters()">
            <mat-option value="">Todas</mat-option>
            <mat-option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select [(ngModel)]="selectedType" (selectionChange)="applyFilters()">
            <mat-option value="">Todos</mat-option>
            <mat-option *ngFor="let type of types" [value]="type.id">
              {{ type.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Mês</mat-label>
          <input matInput [matDatepicker]="monthPicker" 
                 [(ngModel)]="selectedMonth" 
                 (dateChange)="applyFilters()"
                 placeholder="Selecione o mês">
          <mat-datepicker-toggle matSuffix [for]="monthPicker"></mat-datepicker-toggle>
          <mat-datepicker #monthPicker></mat-datepicker>
        </mat-form-field>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="filteredIncomes" matSort class="incomes-table">
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Descrição</th>
              <td mat-cell *matCellDef="let row">{{ row.description }}</td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Valor</th>
              <td mat-cell *matCellDef="let row">{{ row.amount | brl }}</td>
            </ng-container>

            <ng-container matColumnDef="dateExpected">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Data Prevista</th>
              <td mat-cell *matCellDef="let row">{{ row.dateExpected | date:'dd/MM/yyyy' }}</td>
            </ng-container>

            <ng-container matColumnDef="dateEffective">
              <th mat-header-cell *matHeaderCellDef>Data Efetiva</th>
              <td mat-cell *matCellDef="let row">
                {{ row.dateEffective ? (row.dateEffective | date:'dd/MM/yyyy') : '-' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Categoria</th>
              <td mat-cell *matCellDef="let row">{{ row.categoryName }}</td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let row">{{ row.typeName }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let row">
                <mat-chip *ngIf="row.isOverdue" color="warn" class="status-chip">
                  ATRASADO
                </mat-chip>
                <mat-chip *ngIf="row.isPending" class="status-chip chip-amarelo">
                  PENDENTE
                </mat-chip>
                <span *ngIf="!row.isOverdue && !row.isPending" class="status-efetivado">
                  EFETIVADO
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let row">
                <button mat-icon-button color="primary" 
                        *ngIf="isItemOpen(row)"
                        (click)="editIncome(row)" 
                        aria-label="Editar lançamento">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="accent" 
                        *ngIf="isItemOpen(row)"
                        (click)="approveIncome(row)" 
                        aria-label="Aprovar lançamento">
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-icon-button color="warn" 
                        (click)="deleteIncome(row)" 
                        aria-label="Excluir receita">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row"></tr>
          </table>

          <mat-paginator [length]="totalItems" 
                         [pageSize]="pageSize" 
                         [pageSizeOptions]="[5, 10, 25, 50]"
                         (page)="onPageChange($event)">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .receitas-container {
      padding: 20px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    h1 {
      color: #1976d2;
      margin: 0;
    }
    
    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    
    .filters mat-form-field {
      min-width: 200px;
    }
    
    .incomes-table {
      width: 100%;
    }
    
    .status-chip {
      font-size: 12px;
      font-weight: bold;
    }
    
    .chip-amarelo {
      background-color: #F59E0B !important;
      color: #212121 !important;
    }
    
    .status-efetivado {
      color: #4caf50;
      font-weight: 500;
    }
    
    .mat-column-actions {
      width: 120px;
    }
    
    .mat-column-amount {
      width: 120px;
    }
    
    .mat-column-dateExpected,
    .mat-column-dateEffective {
      width: 120px;
    }
    
    .mat-column-status {
      width: 100px;
    }
  `]
})
export class ReceitasComponent implements OnInit {
  incomes: IncomeRow[] = [];
  filteredIncomes: IncomeRow[] = [];
  categories: Category[] = [];
  types: Type[] = [];
  
  selectedCategory = '';
  selectedType = '';
  selectedMonth: Date | null = null;
  
  displayedColumns = ['description', 'amount', 'dateExpected', 'dateEffective', 'category', 'type', 'status', 'actions'];
  
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
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
    this.loadIncomes();
  }

  loadIncomes() {
    const incomes = this.incomesRepo.getAll();
    this.incomes = incomes.map(inc => this.createIncomeRow(inc));
    this.applyFilters();
  }

  private createIncomeRow(income: Income): IncomeRow {
    const category = this.categories.find(cat => cat.id === income.categoryId);
    const type = this.types.find(t => t.id === income.typeId);
    const isOverdue = !income.dateEffective && DateUtil.isPast(income.dateExpected);
    const isPending = !income.dateEffective && DateUtil.isTodayOrFuture(income.dateExpected);

    return {
      id: income.id,
      description: income.description,
      amount: income.amount,
      dateExpected: income.dateExpected,
      dateEffective: income.dateEffective,
      categoryName: category?.name || 'N/A',
      typeName: type?.name || 'N/A',
      observation: income.observation,
      isOverdue,
      isPending,
      income
    };
  }

  // Função helper para verificar se um item está em aberto
  isItemOpen(row: IncomeRow): boolean {
    // Verificar se o item está em aberto (sem data efetiva)
    const hasEffectiveDate = row.dateEffective && 
                            row.dateEffective !== '' && 
                            row.dateEffective !== '-' &&
                            row.dateEffective !== 'null' &&
                            row.dateEffective !== 'undefined';
    
    return !hasEffectiveDate;
  }

  applyFilters() {
    let filtered = [...this.incomes];

    if (this.selectedCategory) {
      filtered = filtered.filter(inc => inc.income.categoryId === this.selectedCategory);
    }

    if (this.selectedType) {
      filtered = filtered.filter(inc => inc.income.typeId === this.selectedType);
    }

    if (this.selectedMonth) {
      const year = this.selectedMonth.getFullYear();
      const month = this.selectedMonth.getMonth() + 1;
      filtered = filtered.filter(inc => DateUtil.isInMonth(inc.dateExpected, year, month));
    }

    this.filteredIncomes = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 0;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(IncomeDialogComponent, {
      data: {
        categories: this.categories,
        types: this.types,
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const created = this.incomesRepo.create(result);
        if (created) {
          this.snackBar.open('Receita criada com sucesso!', 'Fechar', { duration: 3000 });
          this.loadIncomes();
        } else {
          this.snackBar.open('Erro ao criar receita', 'Fechar', { duration: 3000 });
        }
      }
    });
  }

  editIncome(row: IncomeRow) {
    const dialogRef = this.dialog.open(IncomeDialogComponent, {
      data: {
        income: row.income,
        categories: this.categories,
        types: this.types,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updated = this.incomesRepo.update(row.id, result);
        if (updated) {
          this.snackBar.open('Receita atualizada com sucesso!', 'Fechar', { duration: 3000 });
          this.loadIncomes();
        } else {
          this.snackBar.open('Erro ao atualizar receita', 'Fechar', { duration: 3000 });
        }
      }
    });
  }

  approveIncome(row: IncomeRow) {
    const dialogRef = this.dialog.open(EffectiveDialogComponent, {
      data: {
        title: 'Aprovar Receita',
        description: row.description,
        amount: row.amount
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updated = this.incomesRepo.update(row.id, {
          amount: result.amountEffective,
          dateEffective: result.dateEffective,
          observation: result.observation
        });
        
        if (updated) {
          this.snackBar.open('Receita aprovada com sucesso!', 'Fechar', { duration: 3000 });
          this.loadIncomes();
        } else {
          this.snackBar.open('Erro ao aprovar receita', 'Fechar', { duration: 3000 });
        }
      }
    });
  }

  deleteIncome(row: IncomeRow) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir a receita "${row.description}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const deleted = this.incomesRepo.delete(row.id);
        if (deleted) {
          this.snackBar.open('Receita excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.loadIncomes();
        } else {
          this.snackBar.open('Erro ao excluir receita', 'Fechar', { duration: 3000 });
        }
      }
    });
  }
}
