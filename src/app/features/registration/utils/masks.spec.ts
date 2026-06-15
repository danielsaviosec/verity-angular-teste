import {
  maskBirthDate,
  maskCep,
  maskCpf,
  maskPhone,
  maskSalary,
  onlyDigits,
  parseSalary,
} from './masks';

describe('masks', () => {
  it('onlyDigits deve remover tudo que não for número', () => {
    expect(onlyDigits('a1b2c3')).toBe('123');
    expect(onlyDigits('')).toBe('');
  });

  it('maskCpf deve formatar o CPF do Daniel', () => {
    expect(maskCpf('04548040323')).toBe('045.480.403-23');
    expect(maskCpf('045480403239999')).toBe('045.480.403-23');
  });

  it('maskPhone deve formatar celular e telefone fixo de Fortaleza', () => {
    expect(maskPhone('85997900785')).toBe('(85) 99790-0785');
    expect(maskPhone('8533334444')).toBe('(85) 3333-4444');
  });

  it('maskCep deve formatar o CEP do Daniel', () => {
    expect(maskCep('60530320')).toBe('60530-320');
  });

  it('maskBirthDate deve formatar a data de nascimento do Daniel', () => {
    expect(maskBirthDate('30041995')).toBe('30/04/1995');
  });

  it('maskSalary deve formatar moeda e devolver vazio quando não há números', () => {
    expect(maskSalary('500000')).toBe('R$ 5.000,00');
    expect(maskSalary('5')).toBe('R$ 0,05');
    expect(maskSalary('')).toBe('');
  });

  it('parseSalary deve converter o valor mascarado em número', () => {
    expect(parseSalary('R$ 5.000,00')).toBe(5000);
    expect(parseSalary('')).toBe(0);
  });
});
