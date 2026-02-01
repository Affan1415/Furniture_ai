import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header, Footer, ElevenLabsWidget } from '@/components';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'FORMA | Modern Furniture Design',
    template: '%s | FORMA',
  },
  description:
    'Discover curated modern furniture with AI-powered visualization. Experience products from every angle before you buy.',
  keywords: [
    'modern furniture',
    'contemporary design',
    'sofas',
    'chairs',
    'tables',
    'home decor',
    'interior design',
  ],
  authors: [{ name: 'FORMA' }],
  creator: 'FORMA',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'FORMA',
    title: 'FORMA | Modern Furniture Design',
    description:
      'Discover curated modern furniture with AI-powered visualization.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FORMA | Modern Furniture Design',
    description:
      'Discover curated modern furniture with AI-powered visualization.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-stone-900">
        <Header />
        <main className="min-h-screen pt-16 lg:pt-20">{children}</main>
        <Footer />
        <ElevenLabsWidget />
      </body>
    </html>
  );
}
