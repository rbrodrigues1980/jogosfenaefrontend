import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    MatButtonModule
  ],
  templateUrl: './company-form-dialog.html',
  styleUrls: ['./company-form-dialog.css']
})
export class CompanyFormDialogComponent {
  form: FormGroup;

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
