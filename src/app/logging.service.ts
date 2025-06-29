import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Router, Event } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

export interface LogConfig {
  enableClickLogging?: boolean;
  enableRouterLogging?: boolean;
  enableHttpLogging?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

@Injectable({ providedIn: 'root' })
export class LoggingService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private config: LogConfig = {
    enableClickLogging: false, // Desabilitado por padrão para melhor performance
    enableRouterLogging: true,
    enableHttpLogging: true,
    logLevel: 'info'
  };

  constructor(@Inject(DOCUMENT) document: Document, router: Router) {
    this.setupRouterLogging(router);
    this.setupClickLogging(document);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  configure(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
  }

  log(action: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      console.log('[LOG]', action, data);
    }
  }

  debug(action: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]', action, data);
    }
  }

  warn(action: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', action, data);
    }
  }

  error(action: string, data?: unknown): void {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', action, data);
    }
  }

  private setupRouterLogging(router: Router): void {
    if (this.config.enableRouterLogging) {
      router.events
        .pipe(takeUntil(this.destroy$))
        .subscribe((event: Event) => {
          this.log('RouterEvent', event);
        });
    }
  }

  private setupClickLogging(document: Document): void {
    if (this.config.enableClickLogging) {
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const info = target && target.tagName ? `${target.tagName.toLowerCase()}` : '';
        this.log('Click', { target: info });
      });
    }
  }

  private shouldLog(level: LogConfig['logLevel']): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel || 'info');
    const messageLevelIndex = levels.indexOf(level || 'info');

    return messageLevelIndex >= currentLevelIndex;
  }
}
