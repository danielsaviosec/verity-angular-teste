import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { lastValueFrom, Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

@Injectable()
class ConcreteApiService extends ApiBaseService {
  testGet<T>(path: string): Observable<T> {
    return this.get<T>(path);
  }

  testPost<T>(path: string, body: unknown): Observable<T> {
    return this.post<T>(path, body);
  }
}

describe('ApiBaseService', () => {
  let service: ConcreteApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ConcreteApiService],
    });
    service = TestBed.inject(ConcreteApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  describe('get()', () => {
    it('should make a GET request to baseUrl + path', async () => {
      const resultPromise = lastValueFrom(service.testGet<{ id: number }>('/items'));

      const req = httpController.expectOne('/api/items');
      expect(req.request.method).toBe('GET');
      req.flush({ id: 1 });

      expect(await resultPromise).toEqual({ id: 1 });
    });
  });

  describe('post()', () => {
    it('should make a POST request to baseUrl + path with body', async () => {
      const resultPromise = lastValueFrom(service.testPost<{ created: boolean }>('/items', { name: 'test' }));

      const req = httpController.expectOne('/api/items');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ name: 'test' });
      req.flush({ created: true });

      expect(await resultPromise).toEqual({ created: true });
    });
  });
});
