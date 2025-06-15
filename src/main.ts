import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
// @ts-ignore
import { appConfig } from './app/app.config';
// @ts-ignore
import { App } from './app/app';

registerLocaleData(localePt, 'pt-BR');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
