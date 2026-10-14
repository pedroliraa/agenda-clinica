'use client';

import { useCallback, useEffect, useState } from 'react';
import { AppointmentDetails, fetchAppointments } from '../../lib/api';

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const dayKey = (iso: string) => new Date(iso).toLocaleDateString('en-CA');

export default function ClinicPage() {
  const [items, setItems] = useState<AppointmentDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await fetchAppointments());
      setError('');
    } catch {
      setError('Não foi possível carregar a agenda. A API está no ar?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 5000); // atualiza sozinha, bom para a demo
    return () => clearInterval(timer);
  }, [load]);

  const groups = new Map<string, AppointmentDetails[]>();
  items.forEach((item) => {
    const key = dayKey(item.startsAt);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  });

  return (
    <main className="container">
      <h1>Agenda da clínica</h1>
      <p className="subtitle">Clínica Vida Laboratório · próximos agendamentos (atualiza a cada 5 s).</p>

      {error && <div className="alert error">{error}</div>}
      {loading && <p className="muted">Carregando…</p>}
      {!loading && !error && items.length === 0 && (
        <p className="muted">Nenhum agendamento ainda.</p>
      )}

      {Array.from(groups, ([key, list]) => (
        <section className="card" key={key}>
          <h2 style={{ textTransform: 'capitalize' }}>{dayLabel(list[0].startsAt)}</h2>
          {list.map((a) => (
            <p key={a.id} style={{ margin: '8px 0' }}>
              <strong>{timeLabel(a.startsAt)}</strong> · {a.examTypeName} — {a.patientName}{' '}
              <span className="muted">({a.patientPhone})</span>
            </p>
          ))}
        </section>
      ))}
    </main>
  );
}
