import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Registration } from './registration';
import { PdfExportService } from '../../core/services/pdf/pdf-export.service';
import { Profession } from '../../domain/entities/profession.entity';

describe('Registration', () => {
  let fixture: ComponentFixture<Registration>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let registrationComponent: any;
  let httpController: HttpTestingController;
  const pdfExportSpy = { export: jest.fn() };

  const availableProfessions: Profession[] = [
    { id: '1', label: 'Programador' },
    { id: '2', label: 'Médico' },
  ];

  const danielCep = '60530-320';
  const fortalezaViaCepResponse = {
    logradouro: 'Rua 206',
    bairro: 'Conjunto Ceará',
    localidade: 'Fortaleza',
    uf: 'CE',
  };

  const fillPersonalStepWithDaniel = () =>
    registrationComponent.personalForm.setValue({
      fullName: 'Daniel Secundino',
      birthDate: '30/04/1995',
      cpf: '045.480.403-23',
      phone: '(85) 99790-0785',
    });

  const fillResidentialStepWithDaniel = () =>
    registrationComponent.residentialForm.setValue({
      zipCode: danielCep,
      address: 'Rua 206',
      neighborhood: 'Conjunto Ceará',
      city: 'Fortaleza',
      state: 'CE',
    });

  const fillProfessionalStepWithDaniel = () =>
    registrationComponent.professionalForm.setValue({
      profession: 'Programador',
      company: 'Verity',
      salary: 'R$ 5.000,00',
    });

  beforeEach(() => {
    pdfExportSpy.export.mockClear();

    TestBed.configureTestingModule({
      imports: [Registration],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PdfExportService, useValue: pdfExportSpy },
      ],
    });

    fixture = TestBed.createComponent(Registration);
    registrationComponent = fixture.componentInstance;
    httpController = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
    httpController.expectOne('/api/professions').flush(availableProfessions);
  });

  afterEach(() => httpController.verify());

  it('deve criar o componente e carregar as profissões na inicialização', () => {
    expect(registrationComponent).toBeTruthy();
    expect(registrationComponent.professions()).toEqual(availableProfessions);
  });

  it('não deve avançar quando a etapa atual está inválida', () => {
    registrationComponent.next();
    expect(registrationComponent.currentStep()).toBe(0);
    expect(registrationComponent.personalForm.touched).toBe(true);
  });

  it('deve avançar e voltar entre as etapas', () => {
    fillPersonalStepWithDaniel();
    registrationComponent.next();
    expect(registrationComponent.currentStep()).toBe(1);

    registrationComponent.back();
    expect(registrationComponent.currentStep()).toBe(0);
  });

  it('deve preencher o endereço do Daniel automaticamente ao sair do campo de CEP', () => {
    fillPersonalStepWithDaniel();
    registrationComponent.next();

    registrationComponent.residentialForm.controls.zipCode.setValue(danielCep);
    registrationComponent.onCepBlur();

    const viaCepRequest = httpController.expectOne('https://viacep.com.br/ws/60530320/json/');
    viaCepRequest.flush(fortalezaViaCepResponse);

    expect(registrationComponent.residentialForm.controls.address.value).toBe('Rua 206');
    expect(registrationComponent.residentialForm.controls.city.value).toBe('Fortaleza');
  });

  it('deve mostrar um erro quando o ViaCEP falha', () => {
    registrationComponent.residentialForm.controls.zipCode.setValue('00000-000');
    registrationComponent.onCepBlur();

    const viaCepRequest = httpController.expectOne('https://viacep.com.br/ws/00000000/json/');
    viaCepRequest.flush({ erro: true });

    expect(registrationComponent.cepError()).toContain('CEP não encontrado');
  });

  it('não deve chamar o ViaCEP quando o CEP está incompleto', () => {
    registrationComponent.residentialForm.controls.zipCode.setValue('123');
    registrationComponent.onCepBlur();
    httpController.expectNone('https://viacep.com.br/ws/123/json/');
  });

  it('deve chegar ao resumo e guardar todos os dados do Daniel no store', () => {
    fillPersonalStepWithDaniel();
    registrationComponent.next();
    fillResidentialStepWithDaniel();
    registrationComponent.next();
    fillProfessionalStepWithDaniel();
    registrationComponent.next();

    expect(registrationComponent.showSummary()).toBe(true);
    expect(registrationComponent.store.personalData()?.fullName).toBe('Daniel Secundino');
    expect(registrationComponent.store.professionalInfo()?.salary).toBe(5000);
  });

  it('deve exportar o pdf com o resumo guardado', () => {
    fillPersonalStepWithDaniel();
    registrationComponent.next();
    fillResidentialStepWithDaniel();
    registrationComponent.next();
    fillProfessionalStepWithDaniel();
    registrationComponent.next();

    registrationComponent.exportPdf();
    expect(pdfExportSpy.export).toHaveBeenCalledTimes(1);
  });

  it('não deve exportar o pdf quando faltam dados', () => {
    registrationComponent.restart();
    registrationComponent.exportPdf();
    expect(pdfExportSpy.export).not.toHaveBeenCalled();
  });

  it('deve aplicar uma máscara ao valor de um campo', () => {
    const cpfControl = registrationComponent.personalForm.controls.cpf;
    cpfControl.setValue('12345678901');
    registrationComponent.applyMask(cpfControl, registrationComponent.masks.maskCpf);
    expect(cpfControl.value).toBe('123.456.789-01');
  });

  it('deve pular para uma etapa específica com editStep', () => {
    registrationComponent.editStep(2);
    expect(registrationComponent.currentStep()).toBe(2);
  });

  it('deve reiniciar o assistente de cadastro', () => {
    fillPersonalStepWithDaniel();
    registrationComponent.next();
    registrationComponent.restart();

    expect(registrationComponent.currentStep()).toBe(0);
    expect(registrationComponent.store.personalData()).toBeNull();
    expect(registrationComponent.personalForm.controls.fullName.value).toBeNull();
  });
});
