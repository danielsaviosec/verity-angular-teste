export interface PersonalData {
  fullName: string;
  birthDate: string;
  cpf: string;
  phone: string;
}

export interface ResidentialInfo {
  address: string;
  neighborhood: string;
  zipCode: string;
  city: string;
  state: string;
}

export interface ProfessionalInfo {
  profession: string;
  company: string;
  salary: number;
}

export interface User {
  id: string;
  personalData: PersonalData;
  residentialInfo: ResidentialInfo;
  professionalInfo: ProfessionalInfo;
}
