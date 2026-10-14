import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.examType.deleteMany();
  await prisma.clinic.deleteMany();

  const clinic = await prisma.clinic.create({
    data: { name: 'Clínica Vida Laboratório' },
  });

  const exams = await Promise.all([
    prisma.examType.create({
      data: { name: 'Hemograma', durationMinutes: 15, clinicId: clinic.id },
    }),
    prisma.examType.create({
      data: { name: 'Glicemia em jejum', durationMinutes: 10, clinicId: clinic.id },
    }),
  ]);

  const slots: { startsAt: Date; clinicId: string; examTypeId: string }[] = [];
  for (let day = 1; day <= 5; day++) {
    for (const exam of exams) {
      for (let minutes = 7 * 60; minutes < 11 * 60; minutes += 30) {
        const startsAt = new Date();
        startsAt.setDate(startsAt.getDate() + day);
        startsAt.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
        slots.push({ startsAt, clinicId: clinic.id, examTypeId: exam.id });
      }
    }
  }
  await prisma.slot.createMany({ data: slots });

  console.log(`Seed ok: 1 clínica, ${exams.length} exames, ${slots.length} horários`);
}

main().finally(() => prisma.$disconnect());
