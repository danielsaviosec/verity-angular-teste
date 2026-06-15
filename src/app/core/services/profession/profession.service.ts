import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../api/api-base.service';
import { Profession } from '../../../domain/entities/profession.entity';

@Injectable({ providedIn: 'root' })
export class ProfessionService extends ApiBaseService {
  getProfessions(): Observable<Profession[]> {
    return this.get<Profession[]>('/professions');
  }
}
