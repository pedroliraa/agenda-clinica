import { Inject, Injectable } from '@nestjs/common';
import {
  APPOINTMENT_REPOSITORY,
  AppointmentDetails,
  AppointmentRepository,
} from '../domain/appointment.repository';

@Injectable()
export class ListAppointmentsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointments: AppointmentRepository,
  ) {}

  execute(): Promise<AppointmentDetails[]> {
    return this.appointments.listUpcoming();
  }
}
