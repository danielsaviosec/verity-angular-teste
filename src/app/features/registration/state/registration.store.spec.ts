import { RegistrationStore } from './registration.store';

describe('RegistrationStore', () => {
  let registrationStore: RegistrationStore;

  const danielPersonalData = {
    fullName: 'Daniel Secundino',
    birthDate: '30/04/1995',
    cpf: '045.480.403-23',
    phone: '(85) 99790-0785',
  };

  const danielResidentialInfo = {
    address: 'Rua 206',
    neighborhood: 'Conjunto Ceará',
    zipCode: '60530-320',
    city: 'Fortaleza',
    state: 'CE',
  };

  const danielProfessionalInfo = {
    profession: 'Programador',
    company: 'Verity',
    salary: 5000,
  };

  beforeEach(() => {
    registrationStore = new RegistrationStore();
  });

  it('deve começar vazio e incompleto', () => {
    expect(registrationStore.personalData()).toBeNull();
    expect(registrationStore.residentialInfo()).toBeNull();
    expect(registrationStore.professionalInfo()).toBeNull();
    expect(registrationStore.isComplete()).toBe(false);
  });

  it('deve ficar completo depois que o Daniel preenche todas as etapas', () => {
    registrationStore.setPersonalData(danielPersonalData);
    registrationStore.setResidentialInfo(danielResidentialInfo);
    registrationStore.setProfessionalInfo(danielProfessionalInfo);

    expect(registrationStore.isComplete()).toBe(true);
  });

  it('deve apagar tudo quando o Daniel decide recomeçar', () => {
    registrationStore.setPersonalData(danielPersonalData);
    registrationStore.reset();

    expect(registrationStore.personalData()).toBeNull();
    expect(registrationStore.isComplete()).toBe(false);
  });
});
