import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, DM_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header/Header';
import { MobileNav } from '@/components/layout/MobileNav/MobileNav';
import { Footer } from '@/components/layout/Footer/Footer';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastContainer } from '@/components/ui/Toast/ToastContainer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--nq-font-body',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--nq-font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--nq-font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

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
  other: {
    'theme-color': '#0A0A0C',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="%23F5A623"/><path d="M16 2a14 14 0 0 0 0 28M16 2a14 14 0 0 1 0 28M2 16h28M16 2c-3.5 4-5.5 9-5.5 14s2 10 5.5 14M16 2c3.5 4 5.5 9 5.5 14s-2 10-5.5 14" stroke="%230A0A0C" stroke-width="1.5" fill="none"/></svg>',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${plusJakartaSans.variable} ${dmMono.variable}`}>
        <AuthProvider>
          <Header />
          <main className="nq-main">
            {children}
          </main>
          <Footer />
          <MobileNav />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
