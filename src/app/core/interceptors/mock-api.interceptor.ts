import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { CepRequest, CepResponse } from '../../domain/entities/cep.entity';
import { Profession } from '../../domain/entities/profession.entity';

const CEP_DATABASE: Record<string, CepResponse> = {
  '60530320': { address: 'Rua 206', neighborhood: 'Conjunto Ceará', city: 'Fortaleza', state: 'CE' },
  '87654321': { address: 'Rua do Batman', neighborhood: 'Bairro do Morcego', city: 'Rio de Janeiro', state: 'RJ' },
  '12457890': { address: 'Avenida Famosa', neighborhood: 'Centro', city: 'São Paulo', state: 'SP' },
  '11223344': { address: 'Avenida da Igreja', neighborhood: 'Centro Histórico', city: 'Recife', state: 'PE' },
  '55667788': { address: 'Rua das Araucárias', neighborhood: 'Centro', city: 'Curitiba', state: 'PR' },
};

const PROFESSIONS: Profession[] = [
  { id: '1', label: 'Programador' },
  { id: '2', label: 'Médico' },
  { id: '3', label: 'Advogado' },
  { id: '4', label: 'Professor' },
  { id: '5', label: 'Arquiteto' },
];

function mockCepResponse(cep: string): CepResponse {
  const normalizedCep = cep.replace(/\D/g, '');
  return (
    CEP_DATABASE[normalizedCep] ?? {
      address: 'Rua Exemplo',
      neighborhood: 'Bairro Exemplo',
      city: 'Cidade Exemplo',
      state: 'SP',
    }
  );
}

export const mockApiInterceptor: HttpInterceptorFn = (request, nextHandler) => {
  if (request.url.endsWith('/api/cep') && request.method === 'POST') {
    const cepRequestBody = request.body as CepRequest;
    return of(new HttpResponse({ status: 200, body: mockCepResponse(cepRequestBody.cep) }));
  }

  if (request.url.endsWith('/api/professions') && request.method === 'GET') {
    return of(new HttpResponse<Profession[]>({ status: 200, body: PROFESSIONS }));
  }

  return nextHandler(request);
};
