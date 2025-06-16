import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
  editionId?: string | null;

  constructor(
    private api: CompanyApi,
    private dialog: MatDialog,
    private logger: LoggingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.logger.log('company component init');
    this.route.paramMap.subscribe(params => {
      this.editionId = params.get('editionId');
      this.logger.log('editionId param', this.editionId);
      this.load();
    });
  }

  load() {
    this.logger.log('list companies');
    // Clear the current list so old data is not displayed if the request fails
    this.companies = [];
    if (this.editionId) {
      this.api
        .listByEdition(this.editionId)
        .subscribe(
          data =>
            (this.companies = data.filter(c => c.edition?.id === this.editionId))
        );
    } else {
      this.api.list().subscribe(data => (this.companies = data));
    }
  }

  add() {
    const dialogRef = this.dialog.open(CompanyFormDialogComponent, {
      data: { editionId: this.editionId ?? undefined }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logger.log('create company', result);
        const editionId = this.editionId ?? result.editionId;
        this.api.create(editionId, result).subscribe({
          next: () => this.load(),
          error: err => alert(err.error?.message || 'Erro ao criar APCEF')
        });
      }
    });
  }

  edit(item: CompanyDto) {
    const dialogRef = this.dialog.open(CompanyFormDialogComponent, { data: { company: item } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && item.id) {
        this.logger.log('update company', { id: item.id, ...result });
        this.api.update(item.id, result).subscribe({
          next: () => this.load(),
          error: err => alert(err.error?.message || 'Erro ao atualizar APCEF')
        });
      }
    });
  }

  delete(item: CompanyDto) {
    if (item.id) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { message: 'Excluir esta APCEF?' } });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.logger.log('delete company', { id: item.id });
          this.api.delete(item.id!).subscribe(() => this.load());
        }
      });
    }
  }
}
