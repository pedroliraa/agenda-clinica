export class InvalidDateError extends Error {
  constructor(value: string) {
    super(`Data inválida: "${value}". Use o formato AAAA-MM-DD.`);
  }
}
