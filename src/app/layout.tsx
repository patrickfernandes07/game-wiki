import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/session-provider';
import { ToastProvider } from '@/components/providers/toast-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Tibia Wiki',
    template: '%s | Tibia Wiki',
  },
  description:
    'Wiki completa de Tibia com informações sobre monstros, equipamentos, itens e ferramentas úteis para jogadores.',
  keywords: [
    'tibia',
    'tibia wiki',
    'mmorpg',
    'monstros',
    'equipamentos',
    'itens',
    'calculadora',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </div>
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}