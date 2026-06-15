import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { CepRequest, CepResponse } from '../../domain/entities/cep.entity';
import { Profession } from '../../domain/entities/profession.entity';

const CEP_DATABASE: Record<string, CepResponse> = {
  '12345678': { address: 'Rua do Daniel', neighborhood: 'Bairro do Daniel', city: 'Ceará', state: 'CE' },
  '87654321': { address: 'Rua do Batman', neighborhood: 'Bairro do Batman', city: 'Rio de Janeiro', state: 'RJ' },
  '12457890': { address: 'Avenida Famosa', neighborhood: 'Centro', city: 'Sao Paulo', state: 'SP' },
  '11223344': { address: 'Avenida da Igreja', neighborhood: 'Centro Histórico', city: 'Recife', state: 'PE' },
  '55667788': { address: 'Rua 105', neighborhood: 'Centro', city: 'Curitiba', state: 'PR' },
};

const PROFESSIONS: Profession[] = [
  { id: '1', label: 'Programador' },
  { id: '2', label: 'Médico' },
  { id: '3', label: 'Advogado' },
  { id: '4', label: 'Professor' },
  { id: '5', label: 'Arquiteto' },
];

function mockCepResponse(cep: string): CepResponse {
  const normalized = cep.replace(/\D/g, '');
  return (
    CEP_DATABASE[normalized] ?? {
      address: 'Rua Exemplo',
      neighborhood: 'Bairro Exemplo',
      city: 'Cidade Exemplo',
      state: 'SP',
    }
  );
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith('/api/cep') && req.method === 'POST') {
    const body = req.body as CepRequest;
    return of(new HttpResponse({ status: 200, body: mockCepResponse(body.cep) }));
  }

  if (req.url.endsWith('/api/professions') && req.method === 'GET') {
    return of(new HttpResponse<Profession[]>({ status: 200, body: PROFESSIONS }));
  }

  return next(req);
};
