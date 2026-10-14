import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ListAvailableSlotsUseCase } from './application/list-available-slots.use-case';
import { SLOT_REPOSITORY } from './domain/slot.repository';
import { PrismaSlotRepository } from './infrastructure/prisma/prisma-slot.repository';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { SlotsController } from './presentation/slots.controller';

@Module({
  controllers: [AppController, SlotsController],
  providers: [
    PrismaService,
    ListAvailableSlotsUseCase,
    { provide: SLOT_REPOSITORY, useClass: PrismaSlotRepository },
  ],
})
export class AppModule {}
