import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EditionDto {
  id?: number;
  createdDateTime: string;
  updatedDateTime: string;
  membershipDate: string;
  startDateTime: string;
  endDateTime: string;
  title: string;
  description: string;
  email: string;
  currentEdition: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EditionApi {
  private baseUrl = '/api/rest/v1/edition';

  constructor(private http: HttpClient) {}

  list(): Observable<EditionDto[]> {
    return this.http.get<EditionDto[]>(this.baseUrl);
  }

  get(id: number): Observable<EditionDto> {
    return this.http.get<EditionDto>(`${this.baseUrl}/${id}`);
  }

  create(edition: EditionDto): Observable<EditionDto> {
    return this.http.post<EditionDto>(this.baseUrl, edition);
  }

  update(id: number, edition: EditionDto): Observable<EditionDto> {
    return this.http.put<EditionDto>(`${this.baseUrl}/${id}`, edition);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
