import { Routes } from '@angular/router';
import { EditionComponent } from './edition/edition';
import { CompanyComponent } from './company/company';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  { path: 'edition', component: EditionComponent },
  { path: 'company', component: CompanyComponent },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
