import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../shared/services/base-api.service';
import { CompanyDto } from '../shared/types/common';

@Injectable({
  providedIn: 'root'
})
export class CompanyApi extends BaseApiService<CompanyDto> {
  protected endpoint = 'company';

  constructor(http: HttpClient) {
    super(http);
  }

  listByEdition(editionId: string): Observable<CompanyDto[]> {
    return this.list({ editionId });
  }

  createWithEdition(editionId: string, company: Partial<CompanyDto>): Observable<CompanyDto> {
    return this.createWithParams({ editionId }, company);
  }

  override create(data: Partial<CompanyDto>): Observable<CompanyDto> {
    return super.create(data);
  }
}
