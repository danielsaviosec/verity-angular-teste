import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';
import { CepService } from './cep.service';

describe('CepService', () => {
  let cepService: CepService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), CepService],
    });
    cepService = TestBed.inject(CepService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  describe('searchByCep()', () => {
    it('deve chamar o ViaCEP com o CEP do Daniel limpo e mapear a resposta', async () => {
      const danielAddressPromise = lastValueFrom(cepService.searchByCep('60530-320'));

      const viaCepRequest = httpController.expectOne('https://viacep.com.br/ws/60530320/json/');
      expect(viaCepRequest.request.method).toBe('GET');
      viaCepRequest.flush({
        logradouro: 'Rua 206',
        bairro: 'Conjunto Ceará',
        localidade: 'Fortaleza',
        uf: 'CE',
      });

      expect(await danielAddressPromise).toEqual({
        address: 'Rua 206',
        neighborhood: 'Conjunto Ceará',
        city: 'Fortaleza',
        state: 'CE',
      });
    });

    it('deve lançar erro quando o ViaCEP responde que o CEP não existe', async () => {
      const lostCepPromise = lastValueFrom(cepService.searchByCep('00000000'));

      const viaCepRequest = httpController.expectOne('https://viacep.com.br/ws/00000000/json/');
      viaCepRequest.flush({ erro: true });

      await expect(lostCepPromise).rejects.toThrow('CEP não encontrado');
    });
  });
});
