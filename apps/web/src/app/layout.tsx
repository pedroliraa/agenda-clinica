import "./globals.css"
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Agenda Clínica',
  description: 'Agendamento de coleta de exames',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
