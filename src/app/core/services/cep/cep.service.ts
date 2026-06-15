import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CepResponse } from '../../../domain/entities/cep.entity';

interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CepService {
  private readonly httpClient = inject(HttpClient);

  searchByCep(cep: string): Observable<CepResponse> {
    const digitsOnlyCep = cep.replace(/\D/g, '');

    return this.httpClient
      .get<ViaCepResponse>(`https://viacep.com.br/ws/${digitsOnlyCep}/json/`)
      .pipe(
        map((viaCepResponse) => {
          if (viaCepResponse.erro) {
            throw new Error('CEP não encontrado');
          }

          return {
            address: viaCepResponse.logradouro,
            neighborhood: viaCepResponse.bairro,
            city: viaCepResponse.localidade,
            state: viaCepResponse.uf,
          };
        }),
      );
  }
}
