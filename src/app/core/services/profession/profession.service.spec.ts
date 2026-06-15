import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';
import { ProfessionService } from './profession.service';
import { Profession } from '../../../domain/entities/profession.entity';

describe('ProfessionService', () => {
  let service: ProfessionService;
  let httpController: HttpTestingController;

  const mockProfessions: Profession[] = [
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
    service = TestBed.inject(ProfessionService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  describe('getProfessions()', () => {
    it('should make GET to /api/professions', async () => {
      const resultPromise = lastValueFrom(service.getProfessions());

      const req = httpController.expectOne('/api/professions');
      expect(req.request.method).toBe('GET');
      req.flush(mockProfessions);

      expect(await resultPromise).toEqual(mockProfessions);
    });
  });
});
