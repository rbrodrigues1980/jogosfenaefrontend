import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EditionDto {
  id?: number;
  createdDateTime: string;
  updatedDateTime: string;
  membershipDate: string;
  bornFrom: string;
  bornUntil: string;
  startDateTime: string;
  endDateTime: string;
  linkExpirationDate: string;
  link: string;
  title: string;
  description: string;
  email: string;
  currentEdition: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EditionApi {
  // Base URL of the edition API. The `apiBaseUrl` already contains the `/api`
  // prefix for all environments, including development where the Angular
  // dev-server proxy forwards requests to the backend.
  private baseUrl = `${environment.apiBaseUrl}/rest/v1/edition`;

  constructor(private http: HttpClient) {}

  list(): Observable<EditionDto[]> {
    return this.http.get<EditionDto[]>(this.baseUrl);
  }

  get(id: number): Observable<EditionDto> {
    return this.http.get<EditionDto>(`${this.baseUrl}/${id}`);
  }

  create(edition: EditionDto): Observable<EditionDto> {
    return this.http.post<EditionDto>(this.baseUrl, edition, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  update(id: number, edition: EditionDto): Observable<EditionDto> {
    return this.http.put<EditionDto>(`${this.baseUrl}/${id}`, edition, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
