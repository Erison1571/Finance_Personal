import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Income } from '../../../models/income.model';
import { Category } from '../../../models/category.model';
import { Type } from '../../../models/type.model';
import { DateUtil } from '../../utils/date.util';

export interface IncomeDialogData {
  income?: Income;
  categories: Category[];
  types: Type[];
  isEdit: boolean;
}

@Component({
  selector: 'app-income-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar' : 'Nova' }} Receita</h2>
    
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descrição</mat-label>
            <input matInput formControlName="description" placeholder="Descrição da receita">
            <mat-error *ngIf="form.get('description')?.hasError('required')">
              Descrição é obrigatória
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Valor</mat-label>
            <input matInput type="number" formControlName="amount" placeholder="0,00" step="0.01" min="0">
            <mat-error *ngIf="form.get('amount')?.hasError('required')">
              Valor é obrigatório
            </mat-error>
            <mat-error *ngIf="form.get('amount')?.hasError('min')">
              Valor deve ser maior que zero
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Data Prevista</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dateExpected">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="form.get('dateExpected')?.hasError('required')">
              Data prevista é obrigatória
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Categoria</mat-label>
            <mat-select formControlName="categoryId">
              <mat-option *ngFor="let category of categories" [value]="category.id">
                {{ category.name }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('categoryId')?.hasError('required')">
              Categoria é obrigatória
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Tipo</mat-label>
            <mat-select formControlName="typeId">
              <mat-option *ngFor="let type of types" [value]="type.id">
                {{ type.name }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('typeId')?.hasError('required')">
              Tipo é obrigatório
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Observação</mat-label>
            <textarea matInput formControlName="observation" placeholder="Observações adicionais" rows="3"></textarea>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{ isEdit ? 'Atualizar' : 'Criar' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .half-width {
      flex: 1;
    }
    
    mat-dialog-content {
      min-width: 500px;
    }
  `]
})
export class IncomeDialogComponent implements OnInit {
  form!: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IncomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IncomeDialogData
  ) {
    this.isEdit = data.isEdit;
  }

  get categories() {
    return this.data.categories;
  }

  get types() {
    return this.data.types;
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      dateExpected: ['', Validators.required],
      categoryId: ['', Validators.required],
      typeId: ['', Validators.required],
      observation: ['']
    });

    if (this.isEdit && this.data.income) {
      const income = this.data.income;
      this.form.patchValue({
        description: income.description,
        amount: income.amount,
        dateExpected: new Date(income.dateExpected),
        categoryId: income.categoryId,
        typeId: income.typeId,
        observation: income.observation || ''
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const incomeData = {
        description: formValue.description,
        amount: formValue.amount,
        dateExpected: DateUtil.formatDateISO(formValue.dateExpected),
        categoryId: formValue.categoryId,
        typeId: formValue.typeId,
        observation: formValue.observation || undefined
      };

      this.dialogRef.close(incomeData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
