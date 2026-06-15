import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import {
  PersonalData,
  ProfessionalInfo,
  ResidentialInfo,
} from '../../../domain/entities/user.entity';

export interface RegistrationSummary {
  personalData: PersonalData;
  residentialInfo: ResidentialInfo;
  professionalInfo: ProfessionalInfo;
}

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  export(summary: RegistrationSummary): void {
    const doc = new jsPDF();
    let y = 20;

    const title = (text: string): void => {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(text, 14, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
    };

    const line = (label: string, value: string | number): void => {
      doc.text(`${label}: ${value}`, 18, y);
      y += 7;
    };

    doc.setFontSize(18);
    doc.text('Resumo do Cadastro', 14, y);
    y += 12;

    title('Dados Pessoais');
    line('Nome completo', summary.personalData.fullName);
    line('Data de nascimento', summary.personalData.birthDate);
    line('CPF', summary.personalData.cpf);
    line('Telefone', summary.personalData.phone);
    y += 4;

    title('Informações Residenciais');
    line('Endereço', summary.residentialInfo.address);
    line('Bairro', summary.residentialInfo.neighborhood);
    line('CEP', summary.residentialInfo.zipCode);
    line('Cidade', summary.residentialInfo.city);
    line('Estado', summary.residentialInfo.state);
    y += 4;

    title('Informações Profissionais');
    line('Profissão', summary.professionalInfo.profession);
    line('Empresa', summary.professionalInfo.company);
    line(
      'Salário',
      summary.professionalInfo.salary.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    );

    doc.save('cadastro.pdf');
  }
}
