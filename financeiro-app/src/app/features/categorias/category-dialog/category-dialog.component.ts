import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Category } from '../../../models/category.model';
import { Kind } from '../../../models/kind.enum';
import { CategoriesRepository } from '../../../data/repositories/categories.repository';

export interface CategoryDialogData {
  isEdit: boolean;
  category?: Category;
}

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>
        <mat-icon>{{data.isEdit ? 'edit' : 'add'}}</mat-icon>
        {{data.isEdit ? 'Editar' : 'Nova'}} Categoria
      </h2>
      
      <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <div class="form-content">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nome da Categoria</mat-label>
              <input matInput formControlName="name" placeholder="Ex: Alimentação">
              <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
                Nome é obrigatório
              </mat-error>
              <mat-error *ngIf="categoryForm.get('name')?.hasError('minlength')">
                Nome deve ter pelo menos 2 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tipo</mat-label>
              <mat-select formControlName="kind">
                <mat-option value="Despesa">Despesa</mat-option>
                <mat-option value="Receita">Receita</mat-option>
              </mat-select>
              <mat-error *ngIf="categoryForm.get('kind')?.hasError('required')">
                Tipo é obrigatório
              </mat-error>
            </mat-form-field>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">
            Cancelar
          </button>
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="categoryForm.invalid || isSubmitting">
            <mat-icon>{{data.isEdit ? 'save' : 'add'}}</mat-icon>
            {{data.isEdit ? 'Salvar' : 'Criar'}}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
    }
    
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1976d2;
      margin: 0;
    }
    
    .form-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }
    
    .full-width {
      width: 100%;
    }
    
    mat-dialog-actions {
      padding: 16px 0;
    }
    
    mat-dialog-actions button {
      margin-left: 8px;
    }
  `]
})
export class CategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;
  isSubmitting = false;
  kinds: Kind[] = ['Despesa', 'Receita'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData,
    private categoriesRepository: CategoriesRepository
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      kind: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.isEdit && this.data.category) {
      this.categoryForm.patchValue({
        name: this.data.category.name,
        kind: this.data.category.kind
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.categoryForm.value;
      const now = new Date().toISOString();
      
      if (this.data.isEdit && this.data.category) {
        // Editar categoria existente
        const categoryData = {
          name: formValue.name.trim(),
          kind: formValue.kind,
          updatedAt: now
        };
        const result = this.categoriesRepository.update(this.data.category.id, categoryData);
        if (result) {
          this.dialogRef.close(true);
        } else {
          this.isSubmitting = false;
        }
      } else {
        // Criar nova categoria
        const categoryData = {
          name: formValue.name.trim(),
          kind: formValue.kind,
          createdAt: now,
          updatedAt: now
        };
        const result = this.categoriesRepository.create(categoryData);
        if (result) {
          this.dialogRef.close(true);
        } else {
          this.isSubmitting = false;
        }
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
