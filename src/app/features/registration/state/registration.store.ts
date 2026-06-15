import { Injectable, computed, signal } from '@angular/core';
import {
  PersonalData,
  ProfessionalInfo,
  ResidentialInfo,
} from '../../../domain/entities/user.entity';

@Injectable({ providedIn: 'root' })
export class RegistrationStore {
  readonly personalData = signal<PersonalData | null>(null);
  readonly residentialInfo = signal<ResidentialInfo | null>(null);
  readonly professionalInfo = signal<ProfessionalInfo | null>(null);

  readonly isComplete = computed(
    () => !!this.personalData() && !!this.residentialInfo() && !!this.professionalInfo(),
  );

  setPersonalData(data: PersonalData): void {
    this.personalData.set(data);
  }

  setResidentialInfo(data: ResidentialInfo): void {
    this.residentialInfo.set(data);
  }

  setProfessionalInfo(data: ProfessionalInfo): void {
    this.professionalInfo.set(data);
  }

  reset(): void {
    this.personalData.set(null);
    this.residentialInfo.set(null);
    this.professionalInfo.set(null);
  }
}
