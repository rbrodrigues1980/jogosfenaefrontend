import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EditionDto } from '../edition/edition-api';

export interface CompanyDto {
  id?: string;
  createdDateTime: string;
  updatedDateTime: string;
  title: string;
  participantNumber: number;
  presidentNumber: number;
  sportsDirectorNumber: number;
  athleteNumber: number;
  parathleteNumber: number;
  technicalNumber: number;
  edition?: EditionDto;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyApi {
  private baseUrl = `${environment.apiBaseUrl}/rest/v1/company`;

  constructor(private http: HttpClient) {}

  list(): Observable<CompanyDto[]> {
    return this.http.get<CompanyDto[]>(this.baseUrl);
  }

  listByEdition(editionId: string): Observable<CompanyDto[]> {
    return this.http.get<CompanyDto[]>(`${this.baseUrl}?editionId=${editionId}`);
  }

  get(id: string): Observable<CompanyDto> {
    return this.http.get<CompanyDto>(`${this.baseUrl}/${id}`);
  }

  create(editionId: string, company: CompanyDto): Observable<CompanyDto> {
    return this.http.post<CompanyDto>(`${this.baseUrl}?editionId=${editionId}`, company, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  update(id: string, company: CompanyDto): Observable<CompanyDto> {
    return this.http.put<CompanyDto>(`${this.baseUrl}/${id}`, company, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
