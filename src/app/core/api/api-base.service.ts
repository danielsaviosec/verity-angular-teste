import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class ApiBaseService {
  private readonly httpClient = inject(HttpClient);

  protected readonly baseUrl = '/api';

  protected get<T>(path: string): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}${path}`);
  }

  protected post<T>(path: string, body: unknown): Observable<T> {
    return this.httpClient.post<T>(`${this.baseUrl}${path}`, body);
  }
}
