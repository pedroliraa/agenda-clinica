export interface NewAppointment {
  slotId: string;
  patientName: string;
  patientPhone: string;
}

export interface Appointment extends NewAppointment {
  id: string;
  createdAt: Date;
}

export interface AppointmentDetails {
  id: string;
  startsAt: Date;
  examTypeName: string;
  patientName: string;
  patientPhone: string;
}

export interface AppointmentRepository {
  create(data: NewAppointment): Promise<Appointment>;
  listUpcoming(): Promise<AppointmentDetails[]>;
  listUpcomingByPhone(phone: string): Promise<AppointmentDetails[]>;
}

export const APPOINTMENT_REPOSITORY = Symbol('AppointmentRepository');
