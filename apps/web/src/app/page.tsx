'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Slot, createAppointment, fetchSlots } from '../lib/api';

const dayKey = (iso: string) => new Date(iso).toLocaleDateString('en-CA'); // AAAA-MM-DD, fuso local
const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export default function PatientPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [examId, setExamId] = useState('');
  const [day, setDay] = useState('');
  const [slotId, setSlotId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setSlots(await fetchSlots());
    } catch {
      setError('Não foi possível carregar os horários. A API está no ar?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const exams = useMemo(() => {
    const map = new Map<string, string>();
    slots.forEach((s) => map.set(s.examTypeId, s.examTypeName));
    return Array.from(map, ([id, label]) => ({ id, label }));
  }, [slots]);

  const selectedExam = exams.some((e) => e.id === examId) ? examId : exams[0]?.id ?? '';

  const slotsOfExam = useMemo(
    () => slots.filter((s) => s.examTypeId === selectedExam),
    [slots, selectedExam],
  );

  const days = useMemo(() => {
    const map = new Map<string, string>();
    slotsOfExam.forEach((s) => map.set(dayKey(s.startsAt), dayLabel(s.startsAt)));
    return Array.from(map, ([key, label]) => ({ key, label }));
  }, [slotsOfExam]);

  const selectedDay = days.some((d) => d.key === day) ? day : days[0]?.key ?? '';

  const slotsOfDay = useMemo(
    () => slotsOfExam.filter((s) => dayKey(s.startsAt) === selectedDay),
    [slotsOfExam, selectedDay],
  );

  const chosenSlot = slots.find((s) => s.id === slotId);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!chosenSlot) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await createAppointment({ slotId: chosenSlot.id, patientName: name, patientPhone: phone });
      setSuccess(
        `Agendado! ${chosenSlot.examTypeName} em ${dayLabel(chosenSlot.startsAt)} às ${timeLabel(chosenSlot.startsAt)}.`,
      );
      setSlotId('');
      setName('');
      setPhone('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
      setSlotId('');
    } finally {
      setSubmitting(false);
      await load(); // o horário reservado some da lista
    }
  }

  return (
    <main className="container">
      <h1>Agendamento de exames</h1>
      <p className="subtitle">Clínica Vida Laboratório · escolha o exame, o dia e o horário.</p>

      {success && <div className="alert success">{success}</div>}
      {error && <div className="alert error">{error}</div>}
      {loading && <p className="muted">Carregando horários…</p>}

      {!loading && slots.length === 0 && !error && (
        <p className="muted">Nenhum horário disponível no momento.</p>
      )}

      {slots.length > 0 && (
        <>
          <section className="card">
            <h2>1. Exame</h2>
            <div className="chips">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  type="button"
                  className={`chip ${exam.id === selectedExam ? 'active' : ''}`}
                  onClick={() => {
                    setExamId(exam.id);
                    setSlotId('');
                  }}
                >
                  {exam.label}
                </button>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>2. Dia</h2>
            <div className="chips">
              {days.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  className={`chip ${d.key === selectedDay ? 'active' : ''}`}
                  onClick={() => {
                    setDay(d.key);
                    setSlotId('');
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>3. Horário</h2>
            <div className="chips">
              {slotsOfDay.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`chip ${s.id === slotId ? 'active' : ''}`}
                  onClick={() => setSlotId(s.id)}
                >
                  {timeLabel(s.startsAt)}
                </button>
              ))}
            </div>
          </section>

          <form className="card" onSubmit={onSubmit}>
            <h2>4. Seus dados</h2>
            <label htmlFor="name">Nome completo</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <label htmlFor="phone">Telefone com DDD</label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(83) 99999-0000"
              required
            />
            <button className="primary" type="submit" disabled={!chosenSlot || submitting}>
              {submitting ? 'Agendando…' : chosenSlot ? 'Confirmar agendamento' : 'Escolha um horário'}
            </button>
          </form>
        </>
      )}
    </main>
  );
}
