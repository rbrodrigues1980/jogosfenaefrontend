import { Component, Inject } from '@angular/core';
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
  ValidatorFn,
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
import { EditionDto } from './edition-api';

const startBeforeEndValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const start = group.get('startDateTime')?.value;
  const end = group.get('endDateTime')?.value;
  if (start && end && new Date(start) > new Date(end)) {
    return { startAfterEnd: true };
  }
  return null;
};

const bornRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const from = group.get('bornFrom')?.value;
  const until = group.get('bornUntil')?.value;
  if (from && until && new Date(from) > new Date(until)) {
    return { bornRangeInvalid: true };
  }
  return null;
};

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
export class EditionFormDialogComponent {
  form: FormGroup;
  Editor: any = ClassicEditor;
  startEndMatcher = new CrossFieldErrorMatcher('startAfterEnd');
  bornRangeMatcher = new CrossFieldErrorMatcher('bornRangeInvalid');

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edition?: EditionDto }
  ) {
    this.form = this.fb.group(
      {
        title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
        startDateTime: ['', Validators.required],
        endDateTime: ['', Validators.required],
        membershipDate: ['', Validators.required],
        bornFrom: [''],
        bornUntil: [''],
        linkExpirationDate: [''],
        link: [''],
        description: [''],
        email: [''],
        currentEdition: [false]
      },
      { validators: [startBeforeEndValidator, bornRangeValidator] }
    );

    if (data.edition) {
      this.form.patchValue(data.edition);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
