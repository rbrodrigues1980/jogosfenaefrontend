import { Injectable, Inject } from '@angular/core';
import { Router, Event } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private logs: string[] = [];

  constructor(@Inject(DOCUMENT) document: Document, router: Router) {
    try {
      const stored = localStorage.getItem('app-logs');
      this.logs = stored ? JSON.parse(stored) : [];
    } catch {
      this.logs = [];
    }
    router.events.subscribe((event: Event) => {
      this.log('RouterEvent', event);
    });
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const info = target && target.tagName ? `${target.tagName.toLowerCase()}` : '';
      this.log('Click', { target: info });
    });
  }

  log(action: string, data?: unknown) {
    const entry = `${new Date().toISOString()} ${action} ${JSON.stringify(data ?? '')}`;
    // eslint-disable-next-line no-console
    console.log('[LOG]', action, data);
    this.logs.push(entry);
    try {
      localStorage.setItem('app-logs', JSON.stringify(this.logs));
    } catch {
      // ignore storage errors
    }
  }

  downloadLogs() {
    const blob = new Blob([this.logs.join('\n')], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loginfo.log';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
