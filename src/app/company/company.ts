import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog';
import { CompanyFormDialogComponent } from './company-form-dialog';
import { CompanyApi } from './company-api';
import { CompanyDto } from '../shared/types/common';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
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
export class CompanyComponent implements OnInit, OnDestroy {
  companies: CompanyDto[] = [];
  displayedColumns = [
    'title',
    'participantNumber',
    'edition',
    'actions'
  ];
  editionId?: string | null;
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private api: CompanyApi,
    private dialog: MatDialog,
    private logger: LoggingService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.logger.log('company component init');
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.editionId = params.get('editionId');
        this.logger.log('editionId param', this.editionId);
        this.load();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.logger.log('list companies');
    this.loading = true;
    // Clear the current list so old data is not displayed if the request fails
    this.companies = [];

    const request$ = this.editionId
      ? this.api.listByEdition(this.editionId)
      : this.api.list();

    request$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data) => {
          this.companies = this.editionId
            ? data.filter(c => c.edition?.id === this.editionId)
            : data;
        },
        error: (error) => this.errorHandler.handleError(error, 'CompanyComponent.load')
      });
  }

  add(): void {
    const dialogRef = this.dialog.open(CompanyFormDialogComponent, {
      data: { editionId: this.editionId ?? undefined }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.logger.log('create company', result);
          const editionId = this.editionId ?? result.editionId;
          // Remover editionId do corpo antes de enviar para a API
          const { editionId: _editionId, ...companyData } = result;
          this.api.createWithEdition(editionId, companyData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.load();
                this.errorHandler.showSuccessDialog('APCEF criada com sucesso!');
              },
              error: (error) => this.errorHandler.handleError(error, 'CompanyComponent.add')
            });
        }
      });
  }

  edit(item: CompanyDto): void {
    const dialogRef = this.dialog.open(CompanyFormDialogComponent, {
      data: { company: item }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result && item.id) {
          this.logger.log('update company', { id: item.id, ...result });
          // Remover editionId do corpo antes de enviar para a API
          const { editionId, ...companyData } = result;
          this.api.update(item.id, companyData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.load();
                this.errorHandler.showSuccessDialog('APCEF atualizada com sucesso!');
              },
              error: (error) => this.errorHandler.handleError(error, 'CompanyComponent.edit')
            });
        }
      });
  }

  delete(item: CompanyDto): void {
    if (item.id) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { message: 'Excluir esta APCEF?' }
      });

      dialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          if (result) {
            this.logger.log('delete company', { id: item.id });
            this.api.delete(item.id!)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.load();
                  this.errorHandler.showSuccessDialog('APCEF excluída com sucesso!');
                },
                error: (error) => this.errorHandler.handleError(error, 'CompanyComponent.delete')
              });
          }
        });
    }
  }
}
