import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';
import { mockApiInterceptor } from './mock-api.interceptor';
import { CepResponse } from '../../domain/entities/cep.entity';
import { Profession } from '../../domain/entities/profession.entity';

describe('mockApiInterceptor', () => {
  let http: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockApiInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  describe('POST /api/cep', () => {
    it('should return address for a known CEP', async () => {
      const result = await lastValueFrom(http.post<CepResponse>('/api/cep', { cep: '12345678' }));

      expect(result).toEqual({
        address: 'Rua do Daniel',
        neighborhood: 'Bairro do Daniel',
        city: 'Ceará',
        state: 'CE',
      });
    });

    it('should normalize masked CEP before lookup', async () => {
      const result = await lastValueFrom(http.post<CepResponse>('/api/cep', { cep: '12345-678' }));

      expect(result.city).toBe('Ceará');
      expect(result.state).toBe('CE');
    });
  });

  describe('GET /api/professions', () => {
    it('should return a list with at least 5 professions', async () => {
      const result = await lastValueFrom(http.get<Profession[]>('/api/professions'));

      expect(result.length).toBeGreaterThanOrEqual(5);
    });
  });
});
