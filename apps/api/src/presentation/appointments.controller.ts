import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import {
  CreateAppointmentInput,
  CreateAppointmentUseCase,
} from '../application/create-appointment.use-case';
import { ListAppointmentsUseCase } from '../application/list-appointments.use-case';
import {
  InvalidAppointmentDataError,
  SlotNotFoundError,
  SlotUnavailableError,
} from '../domain/appointment.errors';

@Controller('appointments')
export class AppointmentsController {
    constructor(
        private readonly createAppointment: CreateAppointmentUseCase,
        private readonly listAppointments: ListAppointmentsUseCase,
    ) { }

    @Get()
    list() {
        return this.listAppointments.execute();
    }

    @Post()
    async create(@Body() body: CreateAppointmentInput) {
        try {
            return await this.createAppointment.execute(body ?? {});
        } catch (error) {
            if (error instanceof InvalidAppointmentDataError) {
                throw new BadRequestException(error.message);
            }
            if (error instanceof SlotNotFoundError) {
                throw new NotFoundException(error.message);
            }
            if (error instanceof SlotUnavailableError) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }
}
