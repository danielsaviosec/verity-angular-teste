import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';
import { CepService } from './cep.service';
import { CepResponse } from '../../../domain/entities/cep.entity';

describe('CepService', () => {
  let service: CepService;
  let httpController: HttpTestingController;

  const mockAddress: CepResponse = {
    address: 'Rua do Daniel',
    neighborhood: 'Bairro do Daniel',
    city: 'Ceará',
    state: 'CE',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), CepService],
    });
    service = TestBed.inject(CepService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  describe('searchByCep()', () => {
    it('should make POST to /api/cep with cep in body', async () => {
      const resultPromise = lastValueFrom(service.searchByCep('12345678'));

      const req = httpController.expectOne('/api/cep');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ cep: '12345678' });
      req.flush(mockAddress);

      expect(await resultPromise).toEqual(mockAddress);
    });
  });
});
