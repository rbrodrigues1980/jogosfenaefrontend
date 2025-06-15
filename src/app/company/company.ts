import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog';
import { CompanyFormDialogComponent } from './company-form-dialog';
import { CompanyApi, CompanyDto } from './company-api';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-company',
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
  templateUrl: './company.html',
  styleUrls: ['./company.css']
})
export class CompanyComponent implements OnInit {
  companies: CompanyDto[] = [];
  displayedColumns = ['title', 'edition', 'actions'];

  constructor(private api: CompanyApi, private dialog: MatDialog, private logger: LoggingService) {}

  ngOnInit() {
    this.logger.log('company component init');
    this.load();
  }

  load() {
    this.logger.log('list companies');
    this.api.list().subscribe(data => (this.companies = data));
  }

  add() {
    const dialogRef = this.dialog.open(CompanyFormDialogComponent, { data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logger.log('create company', result);
        this.api.create(result.editionId, result).subscribe(() => this.load());
      }
    });
  }

  edit(item: CompanyDto) {
    const dialogRef = this.dialog.open(CompanyFormDialogComponent, { data: { company: item } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && item.id) {
        this.logger.log('update company', { id: item.id, ...result });
        this.api.update(item.id, result).subscribe(() => this.load());
      }
    });
  }

  delete(item: CompanyDto) {
    if (item.id) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { message: 'Excluir esta APCEF?' } });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.logger.log('delete company', { id: item.id });
          this.api.delete(item.id).subscribe(() => this.load());
        }
      });
    }
  }
}
