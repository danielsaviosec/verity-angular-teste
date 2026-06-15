import { PdfExportService, RegistrationSummary } from './pdf-export.service';

const saveMock = jest.fn();
const textMock = jest.fn();
const setFontSizeMock = jest.fn();
const setFontMock = jest.fn();

jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    save: saveMock,
    text: textMock,
    setFontSize: setFontSizeMock,
    setFont: setFontMock,
  })),
}));

describe('PdfExportService', () => {
  let pdfExportService: PdfExportService;

  const danielSummary: RegistrationSummary = {
    personalData: {
      fullName: 'Daniel Secundino',
      birthDate: '30/04/1995',
      cpf: '045.480.403-23',
      phone: '(85) 99790-0785',
    },
    residentialInfo: {
      address: 'Rua 206',
      neighborhood: 'Conjunto Ceará',
      zipCode: '60530-320',
      city: 'Fortaleza',
      state: 'CE',
    },
    professionalInfo: {
      profession: 'Programador',
      company: 'Verity',
      salary: 5000,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    pdfExportService = new PdfExportService();
  });

  it('deve gerar e salvar um pdf com o resumo do Daniel', () => {
    pdfExportService.export(danielSummary);

    expect(saveMock).toHaveBeenCalledWith('cadastro.pdf');
    expect(textMock).toHaveBeenCalledWith('Resumo do Cadastro', 14, expect.any(Number));

    const printedLines = textMock.mock.calls.map((printedCall) => printedCall[0]).join(' | ');
    expect(printedLines).toContain('Nome completo: Daniel Secundino');
    expect(printedLines).toContain('Profissão: Programador');
  });
});
