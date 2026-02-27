import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Serendale AI — Next-Generation AI & Blockchain Platform',
  description:
    'Serendale AI is a next-generation AI and blockchain platform delivering secure, scalable, and intelligent digital solutions for businesses worldwide.',

  keywords: [
    'AI platform',
    'Blockchain',
    'Web3',
    'Smart contracts',
    'Next.js landing',
    'AI services',
    'Crypto technology',
  ],

  authors: [{ name: 'Serendale AI Team' }],
  creator: 'Serendale AI',
  publisher: 'Serendale AI',

  metadataBase: new URL('https://portfolio-delta-kohl-yezgt1hitj.vercel.app/'),

  openGraph: {
    title: 'Serendale AI — AI Powered Blockchain Ecosystem',
    description:
      'Discover the future of AI-driven blockchain solutions. Secure, scalable and built for innovation.',
    url: 'https://portfolio-delta-kohl-yezgt1hitj.vercel.app/',
    siteName: 'Serendale AI',
    images: [
      {
        url: '/main-img.png',
        width: 1200,
        height: 630,
        alt: 'Serendale AI Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Serendale AI — AI & Blockchain Innovation',
    description: 'Powerful AI-based blockchain solutions designed for scalability and performance.',
    images: ['/main-img.png'],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
