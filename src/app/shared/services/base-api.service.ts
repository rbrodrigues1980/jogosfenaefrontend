import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { BaseEntity } from '../types/common';

export interface QueryParams {
  [key: string]: string | number | boolean;
}

@Injectable()
export abstract class BaseApiService<T extends BaseEntity> {
  protected abstract endpoint: string;

  constructor(protected http: HttpClient) {}

  protected get baseUrl(): string {
    return `${environment.apiBaseUrl}/rest/v1/${this.endpoint}`;
  }

  list(params?: QueryParams): Observable<T[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key].toString());
      });
    }
    return this.http.get<T[]>(this.baseUrl, { params: httpParams });
  }

  get(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<T>): Observable<T> {
    return this.http.post<T>(this.baseUrl, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  update(id: number | string, data: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Método para criar com parâmetros adicionais na URL
  createWithParams(params: QueryParams, data: Partial<T>): Observable<T> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.set(key, params[key].toString());
    });

    return this.http.post<T>(this.baseUrl, data, {
      params: httpParams,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
