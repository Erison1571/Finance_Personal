import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Type } from '../../models/type.model';
import { TypesRepository } from '../../data/repositories/types.repository';

interface TypeRow {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  type: Type;
}

@Component({
  selector: 'app-tipos',
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
    MatDialogModule,
    MatPaginatorModule
  ],
  template: `
    <div class="tipos-container">
      <div class="header">
        <h1>Tipos</h1>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Novo Tipo
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="types" class="types-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nome</th>
              <td mat-cell *matCellDef="let row">{{ row.name }}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Descrição</th>
              <td mat-cell *matCellDef="let row">{{ row.description || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Criado em</th>
              <td mat-cell *matCellDef="let row">{{ row.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let row">
                <button mat-icon-button color="primary" 
                        (click)="editType(row)" 
                        aria-label="Editar tipo">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" 
                        (click)="deleteType(row)" 
                        aria-label="Excluir tipo">
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
    .tipos-container {
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
    
    .types-table {
      width: 100%;
    }
    
    .mat-column-actions {
      width: 100px;
    }
  `]
})
export class TiposComponent implements OnInit {
  types: TypeRow[] = [];
  displayedColumns = ['name', 'description', 'createdAt', 'actions'];
  
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private typesRepo: TypesRepository,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTypes();
  }

  loadTypes() {
    const types = this.typesRepo.getAll();
    this.types = types.map(type => ({
      id: type.id,
      name: type.name,
      description: type.description,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
      type
    }));
    this.totalItems = this.types.length;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openCreateDialog() {
    // Implementar diálogo de criação
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  editType(row: TypeRow) {
    // Implementar diálogo de edição
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  deleteType(row: TypeRow) {
    const deleted = this.typesRepo.delete(row.id);
    if (deleted) {
      this.snackBar.open('Tipo excluído com sucesso!', 'Fechar', { duration: 3000 });
      this.loadTypes();
    } else {
      this.snackBar.open('Erro ao excluir tipo', 'Fechar', { duration: 3000 });
    }
  }
}
