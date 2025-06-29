import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'number' | 'actions';
  format?: string;
}

export interface TableAction {
  icon: string;
  color: 'primary' | 'accent' | 'warn';
  tooltip: string;
  action: string;
  routerLink?: string[];
  disabled?: boolean;
}

@Component({
  selector: 'app-base-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="table-container">
      <mat-progress-bar
        *ngIf="loading"
        mode="indeterminate"
        class="loading-bar">
      </mat-progress-bar>

      <table mat-table [dataSource]="data" class="mat-elevation-z1 table">
        <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
          <th mat-header-cell *matHeaderCellDef>{{ column.label }}</th>
          <td mat-cell *matCellDef="let item">
            <ng-container [ngSwitch]="column.type">
              <ng-container *ngSwitchCase="'date'">
                {{ item[column.key] | date:column.format:'':'pt-BR' }}
              </ng-container>
              <ng-container *ngSwitchCase="'number'">
                {{ item[column.key] | number }}
              </ng-container>
              <ng-container *ngSwitchDefault>
                {{ item[column.key] }}
              </ng-container>
            </ng-container>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions" *ngIf="showActions">
          <th mat-header-cell *matHeaderCellDef>Ações</th>
          <td mat-cell *matCellDef="let item">
            <ng-container *ngFor="let action of actions">
              <button
                *ngIf="!action.routerLink"
                mat-icon-button
                [color]="action.color"
                [disabled]="action.disabled"
                [matTooltip]="action.tooltip"
                (click)="onActionClick(action.action, item)">
                <span class="material-icons">{{ action.icon }}</span>
              </button>

              <button
                *ngIf="action.routerLink"
                mat-icon-button
                [color]="action.color"
                [disabled]="action.disabled"
                [matTooltip]="action.tooltip"
                [routerLink]="action.routerLink">
                <span class="material-icons">{{ action.icon }}</span>
              </button>
            </ng-container>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div *ngIf="!loading && (!data || data.length === 0)" class="no-data">
        <p>Nenhum registro encontrado.</p>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      position: relative;
    }

    .loading-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
    }

    .table {
      width: 100%;
      overflow: auto;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: rgba(0, 0, 0, 0.6);
    }
  `]
})
export class BaseTableComponent<T = any> implements OnDestroy {
  @Input() data: T[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() showActions = true;

  @Output() actionClick = new EventEmitter<{ action: string; item: T }>();

  private destroy$ = new Subject<void>();

  get displayedColumns(): string[] {
    const cols = this.columns.map(col => col.key);
    if (this.showActions) {
      cols.push('actions');
    }
    return cols;
  }

  onActionClick(action: string, item: T): void {
    this.actionClick.emit({ action, item });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
