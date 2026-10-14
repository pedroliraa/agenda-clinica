import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ListAvailableSlotsUseCase } from '../application/list-available-slots.use-case';
import { InvalidDateError } from '../domain/invalid-date.error';

@Controller('slots')
export class SlotsController {
  constructor(private readonly listAvailableSlots: ListAvailableSlotsUseCase) {}

  @Get()
  async list(
    @Query('examTypeId') examTypeId?: string,
    @Query('date') date?: string,
  ) {
    try {
      return await this.listAvailableSlots.execute({ examTypeId, date });
    } catch (error) {
      if (error instanceof InvalidDateError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
