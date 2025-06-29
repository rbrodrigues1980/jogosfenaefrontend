import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../shared/services/base-api.service';
import { EditionDto } from '../shared/types/common';

@Injectable({
  providedIn: 'root'
})
export class EditionApi extends BaseApiService<EditionDto> {
  protected endpoint = 'edition';

  constructor(http: HttpClient) {
    super(http);
  }

  // Métodos específicos da Edition podem ser adicionados aqui
  getCurrentEdition(): Observable<EditionDto | null> {
    return this.http.get<EditionDto | null>(`${this.baseUrl}/current`);
  }

  setCurrentEdition(id: number): Observable<EditionDto> {
    return this.http.put<EditionDto>(`${this.baseUrl}/${id}/current`, {});
  }
}
