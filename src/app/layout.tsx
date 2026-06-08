import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
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
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-[#F5F7FA] text-[#1F2937] antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
