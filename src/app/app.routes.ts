import { Routes } from '@angular/router';
import { EditionComponent } from './edition/edition';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  { path: 'edition', component: EditionComponent },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
