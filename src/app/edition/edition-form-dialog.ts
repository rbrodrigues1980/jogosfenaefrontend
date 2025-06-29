import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  NgForm,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Subject, takeUntil } from 'rxjs';
import { EditionDto } from '../shared/types/common';
import { CustomValidators } from '../shared/validators/custom-validators';
import { LoggingService } from '../logging.service';

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  constructor(private errorKey: string) {}

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.touched);
    const parent = control?.parent;
    const invalidParent = !!(parent && parent.hasError(this.errorKey) && parent.touched);
    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-edition-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    CKEditorModule
  ],
  templateUrl: './edition-form-dialog.html',
  styleUrls: ['./edition-form-dialog.css']
})
export class EditionFormDialogComponent implements OnDestroy {
  form: FormGroup;
  Editor: any = ClassicEditor;
  startEndMatcher = new CrossFieldErrorMatcher('startAfterEnd');
  bornRangeMatcher = new CrossFieldErrorMatcher('invalidDateRange');

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edition?: EditionDto },
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
    this.logger.log('cancel edition dialog');
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      this.logger.log('save edition dialog', this.form.value);
      const formattedData = this.formatDatesForBackend(this.form.value);
      this.dialogRef.close(formattedData);
    } else {
      this.form.markAllAsTouched();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group(
      {
        title: ['', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(255)
        ]],
        startDateTime: ['', Validators.required],
        endDateTime: ['', Validators.required],
        membershipDate: ['', Validators.required],
        bornFrom: [''],
        bornUntil: [''],
        linkExpirationDate: [''],
        link: ['', CustomValidators.validUrl()],
        description: [''],
        email: ['', CustomValidators.validEmail()],
        currentEdition: [false]
      },
      {
        validators: [
          CustomValidators.startBeforeEnd('startDateTime', 'endDateTime'),
          CustomValidators.validDateRange('bornFrom', 'bornUntil')
        ]
      }
    );
  }

  private patchFormData(): void {
    if (this.data.edition) {
      this.form.patchValue(this.data.edition);
    }
  }

  private toBackendDateTime(value: string): string {
    if (!value) return value;
    // Se já estiver no formato correto (com espaço e segundos), retorna como está
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
      return value;
    }
    // Se vier no formato yyyy-MM-ddTHH:mm ou yyyy-MM-ddTHH:mm:ss
    if (value.includes('T')) {
      let [date, time] = value.split('T');
      if (!time) return date; // só a data
      if (time.length === 5) time += ':00'; // adiciona segundos se não houver
      return `${date} ${time}`;
    }
    // Se vier só a data
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
    // Se vier no formato yyyy-MM-dd HH:mm
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(value)) {
      return value + ':00';
    }
    return value;
  }

  private formatDatesForBackend(data: any): any {
    const formatted = { ...data };

    // Formata campos de data/hora para o formato esperado pelo backend Java
    if (formatted.startDateTime) {
      formatted.startDateTime = this.toBackendDateTime(formatted.startDateTime);
    }

    if (formatted.endDateTime) {
      formatted.endDateTime = this.toBackendDateTime(formatted.endDateTime);
    }

    if (formatted.linkExpirationDate) {
      formatted.linkExpirationDate = this.toBackendDateTime(formatted.linkExpirationDate);
    }

    return formatted;
  }
}
