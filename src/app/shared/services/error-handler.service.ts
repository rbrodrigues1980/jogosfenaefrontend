import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../message-dialog/message-dialog';
import { LoggingService } from '../../logging.service';

export interface ErrorOptions {
  title?: string;
  showDialog?: boolean;
  logError?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private dialog: MatDialog,
    private logger: LoggingService
  ) {}

  handleError(error: any, context: string, options: ErrorOptions = {}): void {
    const {
      title = 'Erro',
      showDialog = true,
      logError = true
    } = options;

    const errorMessage = this.extractErrorMessage(error);

    if (logError) {
      this.logger.log('Error', { context, error: errorMessage, originalError: error });
    }

    if (showDialog) {
      this.showErrorDialog(title, errorMessage);
    }
  }

  private extractErrorMessage(error: any): string {
    if (typeof error === 'string') {
      if (error.includes('Unrecognized field "editionId"')) {
        return 'Já existe uma Apcef cadastrada para esta edição.';
      }
      return error;
    }

    if (error?.error?.message) {
      if (error.error.message.includes('Unrecognized field "editionId"')) {
        return 'Já existe uma Apcef cadastrada para esta edição.';
      }
      return error.error.message;
    }

    if (error?.message) {
      if (error.message.includes('Unrecognized field "editionId"')) {
        return 'Já existe uma Apcef cadastrada para esta edição.';
      }
      return error.message;
    }

    if (error?.status === 404) {
      return 'Recurso não encontrado';
    }

    if (error?.status === 403) {
      return 'Acesso negado';
    }

    if (error?.status === 500) {
      return 'Erro interno do servidor';
    }

    return 'Ocorreu um erro inesperado';
  }

  private showErrorDialog(title: string, message: string): void {
    this.dialog.open(MessageDialogComponent, {
      data: {
        title,
        message
      },
      width: '400px'
    });
  }

  showSuccessDialog(message: string, title: string = 'Sucesso'): void {
    this.dialog.open(MessageDialogComponent, {
      data: {
        title,
        message
      },
      width: '400px'
    });
  }
}
