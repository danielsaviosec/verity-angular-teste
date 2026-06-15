import { FormControl } from '@angular/forms';
import {
  birthDateValidator,
  cpfValidator,
  phoneValidator,
  salaryValidator,
} from './registration.validators';

describe('registration validators', () => {
  describe('cpfValidator', () => {
    it('deve retornar null para um campo vazio', () => {
      expect(cpfValidator(new FormControl(''))).toBeNull();
    });

    it('deve aceitar o CPF válido do Daniel', () => {
      expect(cpfValidator(new FormControl('045.480.403-23'))).toBeNull();
    });

    it('deve recusar CPFs inventados pelo Fulano da Silva', () => {
      expect(cpfValidator(new FormControl('111.111.111-11'))).toEqual({ cpf: true });
      expect(cpfValidator(new FormControl('123.456.789-00'))).toEqual({ cpf: true });
      expect(cpfValidator(new FormControl('123'))).toEqual({ cpf: true });
    });
  });

  describe('birthDateValidator', () => {
    it('deve retornar null para um campo vazio', () => {
      expect(birthDateValidator(new FormControl(''))).toBeNull();
    });

    it('deve aceitar a data de nascimento do Daniel', () => {
      expect(birthDateValidator(new FormControl('30/04/1995'))).toBeNull();
    });

    it('deve recusar datas tortas, impossíveis ou do futuro', () => {
      const incompleteDate = '1990';
      const impossibleDate = '31/02/1990';
      const futureDate = '15/06/2999';
      const tooOldDate = '15/06/1800';

      expect(birthDateValidator(new FormControl(incompleteDate))).toEqual({ birthDate: true });
      expect(birthDateValidator(new FormControl(impossibleDate))).toEqual({ birthDate: true });
      expect(birthDateValidator(new FormControl(futureDate))).toEqual({ birthDate: true });
      expect(birthDateValidator(new FormControl(tooOldDate))).toEqual({ birthDate: true });
    });
  });

  describe('phoneValidator', () => {
    it('deve retornar null para um campo vazio', () => {
      expect(phoneValidator(new FormControl(''))).toBeNull();
    });

    it('deve aceitar telefones fixos e celulares', () => {
      const landlinePhone = '(85) 3333-4444';
      const mobilePhone = '(85) 98765-4321';

      expect(phoneValidator(new FormControl(landlinePhone))).toBeNull();
      expect(phoneValidator(new FormControl(mobilePhone))).toBeNull();
    });

    it('deve recusar telefones curtos demais', () => {
      expect(phoneValidator(new FormControl('123'))).toEqual({ phone: true });
    });
  });

  describe('salaryValidator', () => {
    it('deve retornar null para um campo vazio', () => {
      expect(salaryValidator(new FormControl(''))).toBeNull();
    });

    it('deve aceitar salários positivos', () => {
      expect(salaryValidator(new FormControl('R$ 1.500,00'))).toBeNull();
    });

    it('deve recusar salário zerado', () => {
      expect(salaryValidator(new FormControl('R$ 0,00'))).toEqual({ salary: true });
    });
  });
});
