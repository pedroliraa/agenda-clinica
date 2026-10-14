import { Inject, Injectable } from '@nestjs/common';
import { InvalidDateError } from '../domain/invalid-date.error';
import {
  AvailableSlot,
  SLOT_REPOSITORY,
  SlotRepository,
} from '../domain/slot.repository';

export interface ListAvailableSlotsInput {
  examTypeId?: string;
  date?: string; // AAAA-MM-DD
}

@Injectable()
export class ListAvailableSlotsUseCase {
  constructor(
    @Inject(SLOT_REPOSITORY) private readonly slots: SlotRepository,
  ) {}

  execute(input: ListAvailableSlotsInput): Promise<AvailableSlot[]> {
    const now = new Date();
    let from = now;
    let to = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (input.date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
        throw new InvalidDateError(input.date);
      }
      const dayStart = new Date(`${input.date}T00:00:00-03:00`);
      if (Number.isNaN(dayStart.getTime())) {
        throw new InvalidDateError(input.date);
      }
      from = dayStart > now ? dayStart : now; // nunca lista horário que já passou
      to = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    }

    return this.slots.findAvailable({ examTypeId: input.examTypeId, from, to });
  }
}
