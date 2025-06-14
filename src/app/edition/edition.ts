import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { EditionApi, EditionDto } from './edition-api';

@Component({
  selector: 'app-edition',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './edition.html',
  styleUrl: './edition.css'
})
export class EditionComponent implements OnInit {
  editions: EditionDto[] = [];
  displayedColumns = ['title', 'start', 'end', 'actions'];
  form: FormGroup;
  editingId?: number;
  showForm = false;

  constructor(private api: EditionApi, private fb: FormBuilder) {
    this.form = this.fb.group({
      createdDateTime: [''],
      updatedDateTime: [''],
      membershipDate: [''],
      startDateTime: [''],
      endDateTime: [''],
      title: [''],
      description: [''],
      email: [''],
      currentEdition: [false]
    });
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.list().subscribe(data => (this.editions = data));
  }

  add() {
    this.editingId = undefined;
    this.form.reset({ currentEdition: false });
    this.showForm = true;
  }

  edit(item: EditionDto) {
    this.editingId = item.id;
    this.form.patchValue(item);
    this.showForm = true;
  }

  cancel() {
    this.showForm = false;
    this.form.reset();
  }

  save() {
    const val = this.form.value as EditionDto;
    if (this.editingId != null) {
      this.api.update(this.editingId, val).subscribe(() => {
        this.load();
        this.cancel();
      });
    } else {
      this.api.create(val).subscribe(() => {
        this.load();
        this.cancel();
      });
    }
  }

  delete(item: EditionDto) {
    if (item.id != null && confirm('Excluir esta edição?')) {
      this.api.delete(item.id).subscribe(() => this.load());
    }
  }
}
