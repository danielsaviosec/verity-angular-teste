import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';
import { mockApiInterceptor } from './mock-api.interceptor';
import { CepResponse } from '../../domain/entities/cep.entity';
import { Profession } from '../../domain/entities/profession.entity';

describe('mockApiInterceptor', () => {
  let httpClient: HttpClient;
  let httpController: HttpTestingController;

  const danielCep = '60530320';
  const danielCepWithMask = '60530-320';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockApiInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  describe('POST /api/cep', () => {
    it('deve devolver o endereço do Daniel para um CEP conhecido', async () => {
      const danielAddress = await lastValueFrom(
        httpClient.post<CepResponse>('/api/cep', { cep: danielCep }),
      );

      expect(danielAddress).toEqual({
        address: 'Rua 206',
        neighborhood: 'Conjunto Ceará',
        city: 'Fortaleza',
        state: 'CE',
      });
    });

    it('deve limpar a máscara do CEP antes de procurar a casa do Daniel', async () => {
      const danielAddress = await lastValueFrom(
        httpClient.post<CepResponse>('/api/cep', { cep: danielCepWithMask }),
      );

      expect(danielAddress.city).toBe('Fortaleza');
      expect(danielAddress.state).toBe('CE');
    });
  });

  describe('GET /api/professions', () => {
    it('deve devolver uma lista com pelo menos 5 profissões', async () => {
      const availableProfessions = await lastValueFrom(
        httpClient.get<Profession[]>('/api/professions'),
      );

      expect(availableProfessions.length).toBeGreaterThanOrEqual(5);
    });
  });
});
