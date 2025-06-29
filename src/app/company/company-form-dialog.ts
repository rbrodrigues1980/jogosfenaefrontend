import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { CompanyDto } from '../shared/types/common';
import { APCEF_OPTIONS } from '../shared/constants/apcef-options';
import { CustomValidators } from '../shared/validators/custom-validators';
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
export class CompanyFormDialogComponent implements OnDestroy {
  form: FormGroup;
  apcefOptions = APCEF_OPTIONS;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CompanyFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      company?: CompanyDto;
      editionId?: string;
      participantNumber?: number;
    },
    private logger: LoggingService
  ) {
    this.form = this.createForm();
    this.patchFormData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancel(): void {
    this.logger.log('cancel company dialog');
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      this.logger.log('save company dialog', value);
      const { editionId, ...companyData } = value;
      this.dialogRef.close({ ...companyData, editionId });
    } else {
      this.form.markAllAsTouched();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)
      ]],
      participantNumber: [0, [
        Validators.required,
        CustomValidators.positiveNumber()
      ]],
      presidentNumber: [0, [
        Validators.required,
        CustomValidators.positiveNumber()
      ]],
      sportsDirectorNumber: [0, [
        Validators.required,
        CustomValidators.positiveNumber()
      ]],
      athleteNumber: [0, [
        Validators.required,
        CustomValidators.positiveNumber()
      ]],
      parathleteNumber: [0, [
        Validators.required,
        CustomValidators.positiveNumber()
      ]],
      technicalNumber: [0, [
        Validators.required,
        CustomValidators.positiveNumber()
      ]],
      editionId: ['', Validators.required]
    });
  }

  private patchFormData(): void {
    if (this.data.company) {
      this.form.patchValue({
        ...this.data.company,
        editionId: this.data.company.edition?.id
      });
      this.form.get('title')?.disable();
    }

    if (this.data.participantNumber) {
      this.form.patchValue({ participantNumber: this.data.participantNumber });
    }

    if (this.data.editionId) {
      this.form.patchValue({ editionId: this.data.editionId });
    }
  }
}
