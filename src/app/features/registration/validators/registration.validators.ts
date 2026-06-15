import { AbstractControl, ValidationErrors } from '@angular/forms';
import { onlyDigits } from '../utils/masks';

export function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const cpf = onlyDigits(control.value ?? '');
  if (!cpf) {
    return null;
  }

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return { cpf: true };
  }

  const checkDigit = (length: number): number => {
    let weightedSum = 0;
    for (let position = 0; position < length; position++) {
      weightedSum += Number(cpf[position]) * (length + 1 - position);
    }
    const remainder = (weightedSum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  if (checkDigit(9) !== Number(cpf[9]) || checkDigit(10) !== Number(cpf[10])) {
    return { cpf: true };
  }

  return null;
}

export function birthDateValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  if (!value) {
    return null;
  }

  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return { birthDate: true };
  }

  const [, dayStr, monthStr, yearStr] = match;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  if (!isRealDate) {
    return { birthDate: true };
  }

  if (date.getTime() > Date.now() || year < 1900) {
    return { birthDate: true };
  }

  return null;
}

export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const phone = onlyDigits(control.value ?? '');
  if (!phone) {
    return null;
  }

  return phone.length >= 10 && phone.length <= 11 ? null : { phone: true };
}

export function salaryValidator(control: AbstractControl): ValidationErrors | null {
  const digits = onlyDigits(control.value ?? '');
  if (!digits) {
    return null;
  }

  return Number(digits) > 0 ? null : { salary: true };
}
