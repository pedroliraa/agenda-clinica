export interface Slot {
  id: string;
  startsAt: string;
  clinicId: string;
  examTypeId: string;
  examTypeName: string;
}

export interface NewAppointmentInput {
  slotId: string;
  patientName: string;
  patientPhone: string;
}

export interface AppointmentDetails {
  id: string;
  startsAt: string;
  examTypeName: string;
  patientName: string;
  patientPhone: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = 'Erro inesperado. Tente novamente.';
    try {
      const body = await res.json();
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(' ') : body.message;
      }
    } catch {
      // resposta sem JSON: mantém a mensagem padrão
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchSlots(): Promise<Slot[]> {
  return handle<Slot[]>(await fetch(`${API_URL}/slots`, { cache: 'no-store' }));
}

export async function fetchAppointments(): Promise<AppointmentDetails[]> {
  return handle<AppointmentDetails[]>(
    await fetch(`${API_URL}/appointments`, { cache: 'no-store' }),
  );
}

export async function createAppointment(input: NewAppointmentInput) {
  return handle(
    await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  );
}
