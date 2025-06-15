import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CompanyDto } from './company-api';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-company-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './company-form-dialog.html',
  styleUrls: ['./company-form-dialog.css']
})
export class CompanyFormDialogComponent {
  form: FormGroup;
  apcefOptions = [
    { value: 'APCEF/AC', label: 'APCEF/AC' },
    { value: 'APCEF/AL', label: 'APCEF/AL' },
    { value: 'APCEF/AM', label: 'APCEF/AM' },
    { value: 'APCEF/AP', label: 'APCEF/AP' },
    { value: 'APCEF/BA', label: 'APCEF/BA' },
    { value: 'APCEF/CE', label: 'APCEF/CE' },
    { value: 'APCEF/DF', label: 'APCEF/DF' },
    { value: 'APCEF/ES', label: 'APCEF/ES' },
    { value: 'APCEF/GO', label: 'APCEF/GO' },
    { value: 'APCEF/MA', label: 'APCEF/MA' },
    { value: 'APCEF/MG', label: 'APCEF/MG' },
    { value: 'APCEF/MS', label: 'APCEF/MS' },
    { value: 'APCEF/MT', label: 'APCEF/MT' },
    { value: 'APCEF/PA', label: 'APCEF/PA' },
    { value: 'APCEF/PB', label: 'APCEF/PB' },
    { value: 'APCEF/PE', label: 'APCEF/PE' },
    { value: 'APCEF/PI', label: 'APCEF/PI' },
    { value: 'APCEF/PR', label: 'APCEF/PR' },
    { value: 'APCEF/RJ', label: 'APCEF/RJ' },
    { value: 'APCEF/RN', label: 'APCEF/RN' },
    { value: 'APCEF/RO', label: 'APCEF/RO' },
    { value: 'APCEF/RR', label: 'APCEF/RR' },
    { value: 'APCEF/RS', label: 'APCEF/RS' },
    { value: 'APCEF/SC', label: 'APCEF/SC' },
    { value: 'APCEF/SE', label: 'APCEF/SE' },
    { value: 'APCEF/SP', label: 'APCEF/SP' },
    { value: 'APCEF/TO', label: 'APCEF/TO' },
    { value: 'FENAE', label: 'FENAE' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CompanyFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { company?: CompanyDto; editionId?: string },
    private logger: LoggingService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      participantNumber: [0, Validators.required],
      presidentNumber: [0, Validators.required],
      sportsDirectorNumber: [0, Validators.required],
      athleteNumber: [0, Validators.required],
      parathleteNumber: [0, Validators.required],
      technicalNumber: [0, Validators.required],
      editionId: ['', Validators.required]
    });

    if (data.company) {
      this.form.patchValue({ ...data.company, editionId: data.company.edition?.id });
    }
    if (data.editionId) {
      this.form.patchValue({ editionId: data.editionId });
    }
  }

  cancel() {
    this.logger.log('cancel company dialog');
    this.dialogRef.close();
  }

  save() {
    if (this.form.valid) {
      this.logger.log('save company dialog', this.form.value);
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
