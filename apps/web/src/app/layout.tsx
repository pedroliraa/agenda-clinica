import "./globals.css"
import Link from "next/link";
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Agenda Clínica',
  description: 'Agendamento de coleta de exames',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
            <body>
        <nav className="nav">
          <Link href="/">Agendar</Link>
          <Link href="/consultar">Meus agendamentos</Link>
          <Link href="/clinica">Agenda da clínica</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
