import { Routes } from '@angular/router';
import { EditionComponent } from './edition/edition';

export const routes: Routes = [
  { path: 'edition', component: EditionComponent },
  { path: '', pathMatch: 'full', redirectTo: 'edition' },
  { path: '**', redirectTo: 'edition' }
];
