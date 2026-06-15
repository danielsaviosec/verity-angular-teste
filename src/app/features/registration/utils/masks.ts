export function onlyDigits(value: string): string {
  return (value ?? '').replace(/\D/g, '');
}

export function maskCpf(value: string): string {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }

  return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

export function maskCep(value: string): string {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

export function maskBirthDate(value: string): string {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
}

export function maskSalary(value: string): string {
  const digits = onlyDigits(value);
  if (!digits) {
    return '';
  }

  const amountWithCents = (Number(digits) / 100).toFixed(2);
  const [integerPart, decimalPart] = amountWithCents.split('.');
  const integerWithThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `R$ ${integerWithThousands},${decimalPart}`;
}

export function parseSalary(value: string): number {
  const digits = onlyDigits(value);
  return digits ? Number(digits) / 100 : 0;
}
