import { Inject, Injectable } from '@nestjs/common';
import { InvalidAppointmentDataError } from '../domain/appointment.errors';
import {
  APPOINTMENT_REPOSITORY,
  Appointment,
  AppointmentRepository,
} from '../domain/appointment.repository';

export interface CreateAppointmentInput {
  slotId?: string;
  patientName?: string;
  patientPhone?: string;
}

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointments: AppointmentRepository,
  ) {}

  execute(input: CreateAppointmentInput): Promise<Appointment> {
    const slotId = input.slotId?.trim();
    const patientName = input.patientName?.trim();
    const patientPhone = input.patientPhone?.replace(/\D/g, '');

    if (!slotId) {
      throw new InvalidAppointmentDataError('Informe o horário (slotId).');
    }
    if (!patientName || patientName.length < 3) {
      throw new InvalidAppointmentDataError(
        'Informe o nome do paciente (mínimo 3 caracteres).',
      );
    }
    if (!patientPhone || patientPhone.length < 10 || patientPhone.length > 11) {
      throw new InvalidAppointmentDataError(
        'Telefone inválido. Use DDD + número, por exemplo 83999990000.',
      );
    }

    return this.appointments.create({ slotId, patientName, patientPhone });
  }
}
