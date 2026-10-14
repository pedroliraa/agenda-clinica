import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  SlotNotFoundError,
  SlotUnavailableError,
} from '../../domain/appointment.errors';
import {
  Appointment,
  AppointmentRepository,
  NewAppointment,
} from '../../domain/appointment.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: NewAppointment): Promise<Appointment> {
    try {
      return await this.prisma.appointment.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new SlotUnavailableError(); // slotId já usado
        if (error.code === 'P2003') throw new SlotNotFoundError(); // slotId não existe
      }
      throw error;
    }
  }
}
