import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog';
import { EditionFormDialogComponent } from './edition-form-dialog';
import { EditionApi, EditionDto } from './edition-api';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-edition',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './edition.html',
  styleUrls: ['./edition.css']
})
export class EditionComponent implements OnInit {
  editions: EditionDto[] = [];
  displayedColumns = ['title', 'start', 'end', 'actions'];
  constructor(private api: EditionApi, private dialog: MatDialog, private logger: LoggingService) {}

  ngOnInit() {
    this.logger.log('edition component init');
    this.load();
  }

  load() {
    this.logger.log('list editions');
    this.api.list().subscribe(data => (this.editions = data));
  }

  add() {
    const dialogRef = this.dialog.open(EditionFormDialogComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logger.log('create edition', result);
        this.api.create(result).subscribe(() => this.load());
      }
    });
  }

  edit(item: EditionDto) {
    const dialogRef = this.dialog.open(EditionFormDialogComponent, {
      data: { edition: item }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && item.id != null) {
        this.logger.log('update edition', { id: item.id, ...result });
        this.api.update(item.id, result).subscribe(() => this.load());
      }
    });
  }


  delete(item: EditionDto) {
    if (item.id != null) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { message: 'Excluir esta edição?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.logger.log('delete edition', { id: item.id });
          this.api.delete(item.id!).subscribe(() => this.load());
        }
      });
    }
  }
}
