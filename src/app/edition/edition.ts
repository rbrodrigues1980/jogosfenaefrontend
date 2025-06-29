import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog';
import { EditionFormDialogComponent } from './edition-form-dialog';
import { EditionApi } from './edition-api';
import { EditionDto } from '../shared/types/common';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
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
export class EditionComponent implements OnInit, OnDestroy {
  editions: EditionDto[] = [];
  displayedColumns = ['title', 'start', 'end', 'actions'];
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private api: EditionApi,
    private dialog: MatDialog,
    private logger: LoggingService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.logger.log('edition component init');
    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.logger.log('list editions');
    this.loading = true;

    this.api.list()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data) => this.editions = data,
        error: (error) => this.errorHandler.handleError(error, 'EditionComponent.load')
      });
  }

  add(): void {
    const dialogRef = this.dialog.open(EditionFormDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.logger.log('create edition', result);
          this.api.create(result)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.load();
                this.errorHandler.showSuccessDialog('Edição criada com sucesso!');
              },
              error: (error) => this.errorHandler.handleError(error, 'EditionComponent.add')
            });
        }
      });
  }

  edit(item: EditionDto): void {
    const dialogRef = this.dialog.open(EditionFormDialogComponent, {
      data: { edition: item }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result && item.id != null) {
          this.logger.log('update edition', { id: item.id, ...result });
          this.api.update(item.id, result)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.load();
                this.errorHandler.showSuccessDialog('Edição atualizada com sucesso!');
              },
              error: (error) => this.errorHandler.handleError(error, 'EditionComponent.edit')
            });
        }
      });
  }

  delete(item: EditionDto): void {
    if (item.id != null) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { message: 'Excluir esta edição?' }
      });

      dialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          if (result) {
            this.logger.log('delete edition', { id: item.id });
            this.api.delete(item.id!)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.load();
                  this.errorHandler.showSuccessDialog('Edição excluída com sucesso!');
                },
                error: (error) => this.errorHandler.handleError(error, 'EditionComponent.delete')
              });
          }
        });
    }
  }
}
