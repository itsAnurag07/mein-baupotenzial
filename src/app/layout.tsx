import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'mein-baupotenzial.de | van Valkenburg GmbH',
  description: 'Professionelle planungsrechtliche Analyse und Machbarkeitsprüfung für Grundstücke in Deutschland. Finden Sie heraus, was auf Ihrem Grundstück planungsrechtlich möglich ist.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-[#F8F7F4] text-[#5E646B] antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
