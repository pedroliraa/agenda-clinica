import { Inject, Injectable } from '@nestjs/common';
import { InvalidAppointmentDataError } from '../domain/appointment.errors';
import {
  APPOINTMENT_REPOSITORY,
  AppointmentDetails,
  AppointmentRepository,
} from '../domain/appointment.repository';

@Injectable()
export class FindAppointmentsByPhoneUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointments: AppointmentRepository,
  ) {}

  execute(phone?: string): Promise<AppointmentDetails[]> {
    const digits = phone?.replace(/\D/g, '');
    if (!digits || digits.length < 10 || digits.length > 11) {
      throw new InvalidAppointmentDataError(
        'Telefone inválido. Use DDD + número, por exemplo 83999990000.',
      );
    }
    return this.appointments.listUpcomingByPhone(digits);
  }
}
