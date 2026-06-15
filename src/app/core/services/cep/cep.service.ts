import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../api/api-base.service';
import { CepRequest, CepResponse } from '../../../domain/entities/cep.entity';

@Injectable({ providedIn: 'root' })
export class CepService extends ApiBaseService {
  searchByCep(cep: string): Observable<CepResponse> {
    const body: CepRequest = { cep };
    return this.post<CepResponse>('/cep', body);
  }
}
