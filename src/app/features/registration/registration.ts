import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { CepService } from '../../core/services/cep/cep.service';
import { PdfExportService } from '../../core/services/pdf/pdf-export.service';
import { ProfessionService } from '../../core/services/profession/profession.service';
import { Profession } from '../../domain/entities/profession.entity';
import { RegistrationStore } from './state/registration.store';
import {
  maskBirthDate,
  maskCep,
  maskCpf,
  maskPhone,
  maskSalary,
  onlyDigits,
  parseSalary,
} from './utils/masks';
import {
  birthDateValidator,
  cpfValidator,
  phoneValidator,
  salaryValidator,
} from './validators/registration.validators';

const STEP_LABELS = ['Dados Pessoais', 'Informações Residenciais', 'Informações Profissionais'];

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
})
export class Registration implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly cepService = inject(CepService);
  private readonly professionService = inject(ProfessionService);
  private readonly pdfService = inject(PdfExportService);
  protected readonly store = inject(RegistrationStore);

  protected readonly steps = STEP_LABELS;
  protected readonly currentStep = signal(0);
  protected readonly professions = signal<Profession[]>([]);
  protected readonly cepLoading = signal(false);
  protected readonly cepError = signal<string | null>(null);

  protected readonly isLastStep = computed(() => this.currentStep() === this.steps.length - 1);
  protected readonly showSummary = computed(() => this.currentStep() === this.steps.length);

  protected readonly personalForm = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    birthDate: ['', [Validators.required, birthDateValidator]],
    cpf: ['', [Validators.required, cpfValidator]],
    phone: ['', [Validators.required, phoneValidator]],
  });

  protected readonly residentialForm = this.formBuilder.group({
    zipCode: ['', Validators.required],
    address: ['', Validators.required],
    neighborhood: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
  });

  protected readonly professionalForm = this.formBuilder.group({
    profession: ['', Validators.required],
    company: ['', Validators.required],
    salary: ['', [Validators.required, salaryValidator]],
  });

  ngOnInit(): void {
    this.professionService
      .getProfessions()
      .subscribe((loadedProfessions) => this.professions.set(loadedProfessions));
  }

  protected applyMask(control: AbstractControl, mask: (value: string) => string): void {
    control.setValue(mask(control.value ?? ''), { emitEvent: false });
  }

  protected get masks() {
    return { maskCpf, maskPhone, maskCep, maskBirthDate, maskSalary };
  }

  protected onCepBlur(): void {
    const zipCode = this.residentialForm.controls.zipCode.value ?? '';
    if (onlyDigits(zipCode).length !== 8) {
      return;
    }

    this.cepLoading.set(true);
    this.cepError.set(null);

    this.cepService.searchByCep(zipCode).subscribe({
      next: (foundAddress) => {
        this.residentialForm.patchValue({
          address: foundAddress.address,
          neighborhood: foundAddress.neighborhood,
          city: foundAddress.city,
          state: foundAddress.state,
        });
        this.cepLoading.set(false);
      },
      error: () => {
        this.cepError.set('CEP não encontrado. Preencha o endereço manualmente.');
        this.cepLoading.set(false);
      },
    });
  }

  protected next(): void {
    const currentStepForm = this.currentForm();
    if (currentStepForm.invalid) {
      currentStepForm.markAllAsTouched();
      return;
    }

    if (this.isLastStep()) {
      this.saveToStore();
    }

    this.currentStep.update((step) => step + 1);
  }

  protected back(): void {
    this.currentStep.update((step) => Math.max(0, step - 1));
  }

  protected editStep(step: number): void {
    this.currentStep.set(step);
  }

  protected exportPdf(): void {
    const personalData = this.store.personalData();
    const residentialInfo = this.store.residentialInfo();
    const professionalInfo = this.store.professionalInfo();

    if (!personalData || !residentialInfo || !professionalInfo) {
      return;
    }

    this.pdfService.export({ personalData, residentialInfo, professionalInfo });
  }

  protected restart(): void {
    this.personalForm.reset();
    this.residentialForm.reset();
    this.professionalForm.reset();
    this.store.reset();
    this.cepError.set(null);
    this.currentStep.set(0);
  }

  private currentForm() {
    switch (this.currentStep()) {
      case 0:
        return this.personalForm;
      case 1:
        return this.residentialForm;
      default:
        return this.professionalForm;
    }
  }

  private saveToStore(): void {
    const personalValues = this.personalForm.getRawValue();
    const residentialValues = this.residentialForm.getRawValue();
    const professionalValues = this.professionalForm.getRawValue();

    this.store.setPersonalData({
      fullName: personalValues.fullName ?? '',
      birthDate: personalValues.birthDate ?? '',
      cpf: personalValues.cpf ?? '',
      phone: personalValues.phone ?? '',
    });

    this.store.setResidentialInfo({
      address: residentialValues.address ?? '',
      neighborhood: residentialValues.neighborhood ?? '',
      zipCode: residentialValues.zipCode ?? '',
      city: residentialValues.city ?? '',
      state: residentialValues.state ?? '',
    });

    this.store.setProfessionalInfo({
      profession: professionalValues.profession ?? '',
      company: professionalValues.company ?? '',
      salary: parseSalary(professionalValues.salary ?? ''),
    });
  }
}
