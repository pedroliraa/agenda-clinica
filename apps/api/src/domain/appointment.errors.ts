export class InvalidAppointmentDataError extends Error {}

export class SlotNotFoundError extends Error {
  constructor() {
    super('Horário não encontrado.');
  }
}

export class SlotUnavailableError extends Error {
  constructor() {
    super('Este horário já foi reservado. Escolha outro.');
  }
}
