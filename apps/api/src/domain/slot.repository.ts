export interface AvailableSlot {
  id: string;
  startsAt: Date;
  clinicId: string;
  examTypeId: string;
  examTypeName: string;
}

export interface SlotQuery {
  examTypeId?: string;
  from: Date;
  to: Date;
}

export interface SlotRepository {
  findAvailable(query: SlotQuery): Promise<AvailableSlot[]>;
}

export const SLOT_REPOSITORY = Symbol('SlotRepository');
