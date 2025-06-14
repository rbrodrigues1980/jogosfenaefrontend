import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EditionDto } from './edition-api';

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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edition?: EditionDto }
  ) {
    const e = data.edition;
    this.form = this.fb.group({
      title: [e?.title || ''],
      startDateTime: [e?.startDateTime || ''],
      endDateTime: [e?.endDateTime || ''],
      membershipDate: [e?.membershipDate || ''],
      bornFrom: [e?.bornFrom || ''],
      bornUntil: [e?.bornUntil || ''],
      linkExpirationDate: [e?.linkExpirationDate || ''],
      link: [e?.link || ''],
      description: [e?.description || ''],
      email: [e?.email || ''],
      currentEdition: [e?.currentEdition || false]
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
