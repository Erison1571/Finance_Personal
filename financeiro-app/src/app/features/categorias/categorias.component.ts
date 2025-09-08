import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { Category } from '../../models/category.model';
import { Kind } from '../../models/kind.enum';
import { CategoriesRepository } from '../../data/repositories/categories.repository';

interface CategoryRow {
  id: string;
  name: string;
  kind: Kind;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatPaginatorModule,
    MatChipsModule
  ],
  template: `
    <div class="categorias-container">
      <div class="header">
        <h1>Categorias</h1>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nova Categoria
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="categories" class="categories-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nome</th>
              <td mat-cell *matCellDef="let row">{{ row.name }}</td>
            </ng-container>

            <ng-container matColumnDef="kind">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let row">
                <mat-chip [color]="row.kind === 'Receita' ? 'primary' : 'warn'" class="kind-chip">
                  {{ row.kind }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Criado em</th>
              <td mat-cell *matCellDef="let row">{{ row.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let row">
                <button mat-icon-button color="primary" 
                        (click)="editCategory(row)" 
                        aria-label="Editar categoria">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" 
                        (click)="deleteCategory(row)" 
                        aria-label="Excluir categoria">
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
    .categorias-container {
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
    
    .categories-table {
      width: 100%;
    }
    
    .kind-chip {
      font-size: 12px;
      font-weight: bold;
    }
    
    .mat-column-actions {
      width: 100px;
    }
  `]
})
export class CategoriasComponent implements OnInit {
  categories: CategoryRow[] = [];
  displayedColumns = ['name', 'kind', 'createdAt', 'actions'];
  
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private categoriesRepo: CategoriesRepository,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    const categories = this.categoriesRepo.getAll();
    this.categories = categories.map(category => ({
      id: category.id,
      name: category.name,
      kind: category.kind,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      category
    }));
    this.totalItems = this.categories.length;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openCreateDialog() {
    // Implementar diálogo de criação
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  editCategory(row: CategoryRow) {
    // Implementar diálogo de edição
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  deleteCategory(row: CategoryRow) {
    const deleted = this.categoriesRepo.delete(row.id);
    if (deleted) {
      this.snackBar.open('Categoria excluída com sucesso!', 'Fechar', { duration: 3000 });
      this.loadCategories();
    } else {
      this.snackBar.open('Erro ao excluir categoria', 'Fechar', { duration: 3000 });
    }
  }
}
