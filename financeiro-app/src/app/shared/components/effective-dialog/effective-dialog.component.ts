import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateUtil } from '../../utils/date.util';
import { BrlPipe } from '../../pipes/brl.pipe';

export interface EffectiveDialogData {
  title: string;
  description: string;
  amount: number;
}

@Component({
  selector: 'app-effective-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrlPipe
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    
    <mat-dialog-content>
      <div class="info-row">
        <strong>Descrição:</strong> {{ data.description }}
      </div>
      <div class="info-row">
        <strong>Valor Previsto:</strong> {{ data.amount | brl }}
      </div>
      
      <form [formGroup]="form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Valor Efetivado</mat-label>
            <input matInput type="number" formControlName="amountEffective" 
                   placeholder="0,00" step="0.01" min="0">
            <mat-error *ngIf="form.get('amountEffective')?.hasError('required')">
              Valor efetivado é obrigatório
            </mat-error>
            <mat-error *ngIf="form.get('amountEffective')?.hasError('min')">
              Valor deve ser maior que zero
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Data de Efetivação</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dateEffective">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="form.get('dateEffective')?.hasError('required')">
              Data de efetivação é obrigatória
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Observação</mat-label>
            <textarea matInput formControlName="observation" placeholder="Observações sobre a aprovação" rows="3"></textarea>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" type="submit" (click)="onSubmit()" [disabled]="form.invalid">
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .info-row {
      margin-bottom: 16px;
      padding: 8px 0;
    }
    
    .form-row {
      margin-bottom: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class EffectiveDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EffectiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EffectiveDialogData
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      amountEffective: [this.data.amount, [Validators.required, Validators.min(0.01)]],
      dateEffective: [new Date(), Validators.required],
      observation: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const effectiveData = {
        amountEffective: formValue.amountEffective,
        dateEffective: DateUtil.formatDateISO(formValue.dateEffective),
        observation: formValue.observation || undefined
      };

      this.dialogRef.close(effectiveData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
