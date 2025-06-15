import { Injectable, Inject } from '@angular/core';
import { Router, Event } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  constructor(@Inject(DOCUMENT) document: Document, router: Router) {
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
    // eslint-disable-next-line no-console
    console.log('[LOG]', action, data);
  }
}
