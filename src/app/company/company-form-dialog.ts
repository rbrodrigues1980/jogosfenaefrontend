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
    { value: 'APCEFAC', label: 'APCEF/AC' },
    { value: 'APCEFAL', label: 'APCEF/AL' },
    { value: 'APCEFAM', label: 'APCEF/AM' },
    { value: 'APCEFAP', label: 'APCEF/AP' },
    { value: 'APCEFBA', label: 'APCEF/BA' },
    { value: 'APCEFCE', label: 'APCEF/CE' },
    { value: 'APCEFDF', label: 'APCEF/DF' },
    { value: 'APCEFES', label: 'APCEF/ES' },
    { value: 'APCEFGO', label: 'APCEF/GO' },
    { value: 'APCEFMA', label: 'APCEF/MA' },
    { value: 'APCEFMG', label: 'APCEF/MG' },
    { value: 'APCEFMS', label: 'APCEF/MS' },
    { value: 'APCEFMT', label: 'APCEF/MT' },
    { value: 'APCEFPA', label: 'APCEF/PA' },
    { value: 'APCEFPB', label: 'APCEF/PB' },
    { value: 'APCEFPE', label: 'APCEF/PE' },
    { value: 'APCEFPI', label: 'APCEF/PI' },
    { value: 'APCEFPR', label: 'APCEF/PR' },
    { value: 'APCEFRJ', label: 'APCEF/RJ' },
    { value: 'APCEFRN', label: 'APCEF/RN' },
    { value: 'APCEFRO', label: 'APCEF/RO' },
    { value: 'APCEFRR', label: 'APCEF/RR' },
    { value: 'APCEFRS', label: 'APCEF/RS' },
    { value: 'APCEFSC', label: 'APCEF/SC' },
    { value: 'APCEFSE', label: 'APCEF/SE' },
    { value: 'APCEFSP', label: 'APCEF/SP' },
    { value: 'APCEFTO', label: 'APCEF/TO' }
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
