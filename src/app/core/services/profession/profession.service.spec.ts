import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';
import { ProfessionService } from './profession.service';
import { Profession } from '../../../domain/entities/profession.entity';

describe('ProfessionService', () => {
  let professionService: ProfessionService;
  let httpController: HttpTestingController;

  const availableProfessions: Profession[] = [
    { id: '1', label: 'Programador' },
    { id: '2', label: 'Médico' },
    { id: '3', label: 'Advogado' },
    { id: '4', label: 'Professor' },
    { id: '5', label: 'Arquiteto' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProfessionService],
    });
    professionService = TestBed.inject(ProfessionService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  describe('getProfessions()', () => {
    it('deve fazer um GET para /api/professions', async () => {
      const professionsPromise = lastValueFrom(professionService.getProfessions());

      const professionsRequest = httpController.expectOne('/api/professions');
      expect(professionsRequest.request.method).toBe('GET');
      professionsRequest.flush(availableProfessions);

      expect(await professionsPromise).toEqual(availableProfessions);
    });
  });
});
