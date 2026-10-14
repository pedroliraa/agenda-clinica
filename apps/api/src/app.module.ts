import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CreateAppointmentUseCase } from './application/create-appointment.use-case';
import { FindAppointmentsByPhoneUseCase } from './application/find-appointments-by-phone.use-case';
import { ListAppointmentsUseCase } from './application/list-appointments.use-case';
import { ListAvailableSlotsUseCase } from './application/list-available-slots.use-case';
import { APPOINTMENT_REPOSITORY } from './domain/appointment.repository';
import { SLOT_REPOSITORY } from './domain/slot.repository';
import { PrismaAppointmentRepository } from './infrastructure/prisma/prisma-appointment.repository';
import { PrismaSlotRepository } from './infrastructure/prisma/prisma-slot.repository';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { AppointmentsController } from './presentation/appointments.controller';
import { SlotsController } from './presentation/slots.controller';

@Module({
  controllers: [AppController, SlotsController, AppointmentsController],
  providers: [
    PrismaService,
    ListAvailableSlotsUseCase,
    CreateAppointmentUseCase,
    ListAppointmentsUseCase,
    FindAppointmentsByPhoneUseCase,
    { provide: SLOT_REPOSITORY, useClass: PrismaSlotRepository },
    { provide: APPOINTMENT_REPOSITORY, useClass: PrismaAppointmentRepository },
  ],
})
export class AppModule {}
