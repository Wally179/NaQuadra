import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header/Header';
import { MobileNav } from '@/components/layout/MobileNav/MobileNav';

export const metadata: Metadata = {
  title: {
    default: 'Na Quadra — Entenda a NBA. Acompanhe seus times.',
    template: '%s | Na Quadra',
  },
  description:
    'Plataforma brasileira para acompanhar a NBA com contexto, educação e personalização. Do novato ao especialista.',
  keywords: ['NBA', 'basquete', 'basketball', 'times', 'jogadores', 'standings', 'Brasil'],
  authors: [{ name: 'Na Quadra' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Na Quadra',
    title: 'Na Quadra — Entenda a NBA. Acompanhe seus times.',
    description: 'Plataforma brasileira para acompanhar a NBA com contexto e personalização.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Na Quadra',
    description: 'Entenda a NBA. Acompanhe seus times. Viva a quadra.',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏀</text></svg>',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main style={{ paddingBottom: 'var(--nq-mobile-nav-height)' }}>
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
