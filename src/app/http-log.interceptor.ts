import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LoggingService } from './logging.service';

export const httpLogInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggingService);
  logger.log('HTTP request', { method: req.method, url: req.urlWithParams });
  return next(req).pipe(
    tap({
      next: event => {
        logger.log('HTTP response', { url: req.urlWithParams });
      },
      error: error => {
        logger.log('HTTP error', { url: req.urlWithParams, error });
      }
    })
  );
};
