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
  let apiService: ConcreteApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ConcreteApiService],
    });
    apiService = TestBed.inject(ConcreteApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  describe('get()', () => {
    it('deve fazer um GET para baseUrl + path', async () => {
      const userPromise = lastValueFrom(apiService.testGet<{ id: number }>('/users'));

      const getRequest = httpController.expectOne('/api/users');
      expect(getRequest.request.method).toBe('GET');
      getRequest.flush({ id: 1 });

      expect(await userPromise).toEqual({ id: 1 });
    });
  });

  describe('post()', () => {
    it('deve fazer um POST para baseUrl + path com o corpo informado', async () => {
      const danielUser = { name: 'Daniel Secundino' };
      const createdUserPromise = lastValueFrom(
        apiService.testPost<{ created: boolean }>('/users', danielUser),
      );

      const postRequest = httpController.expectOne('/api/users');
      expect(postRequest.request.method).toBe('POST');
      expect(postRequest.request.body).toEqual(danielUser);
      postRequest.flush({ created: true });

      expect(await createdUserPromise).toEqual({ created: true });
    });
  });
});
