'use client';

import { FormEvent, useState } from 'react';
import { AppointmentDetails, fetchAppointmentsByPhone } from '../../lib/api';

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export default function LookupPage() {
  const [phone, setPhone] = useState('');
  const [items, setItems] = useState<AppointmentDetails[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setItems(null);
    try {
      setItems(await fetchAppointmentsByPhone(phone));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Meus agendamentos</h1>
      <p className="subtitle">Informe o telefone usado no agendamento para consultar seus exames.</p>

      <form className="card" onSubmit={onSubmit}>
        <label htmlFor="phone">Telefone com DDD</label>
        <input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(83) 99999-0000"
          required
        />
        <button className="primary" type="submit" disabled={loading}>
          {loading ? 'Consultando…' : 'Consultar'}
        </button>
      </form>

      {error && <div className="alert error">{error}</div>}

      {items && items.length === 0 && (
        <p className="muted">Nenhum agendamento futuro encontrado para este telefone.</p>
      )}

      {items?.map((a) => (
        <section className="card" key={a.id}>
          <h2 style={{ textTransform: 'capitalize' }}>{dayLabel(a.startsAt)}</h2>
          <p style={{ margin: 0 }}>
            <strong>{timeLabel(a.startsAt)}</strong> · {a.examTypeName}
          </p>
          <p className="muted" style={{ margin: '4px 0 0' }}>Paciente: {a.patientName}</p>
        </section>
      ))}
    </main>
  );
}
