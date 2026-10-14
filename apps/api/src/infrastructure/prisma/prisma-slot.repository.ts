import { Injectable } from '@nestjs/common';
import {
  AvailableSlot,
  SlotQuery,
  SlotRepository,
} from '../../domain/slot.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaSlotRepository implements SlotRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAvailable(query: SlotQuery): Promise<AvailableSlot[]> {
    const rows = await this.prisma.slot.findMany({
      where: {
        appointment: { is: null },
        startsAt: { gte: query.from, lt: query.to },
        ...(query.examTypeId ? { examTypeId: query.examTypeId } : {}),
      },
      include: { examType: true },
      orderBy: { startsAt: 'asc' },
    });

    return rows.map((row) => ({
      id: row.id,
      startsAt: row.startsAt,
      clinicId: row.clinicId,
      examTypeId: row.examTypeId,
      examTypeName: row.examType.name,
    }));
  }
}
