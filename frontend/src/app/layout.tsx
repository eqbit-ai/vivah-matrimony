import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Vivah Matrimony - Find Your Perfect Life Partner',
  description: 'Premium Indian matrimonial platform to find your soulmate. Trusted by thousands of families for arranging perfect matches.',
  keywords: 'matrimony, indian matrimony, marriage, wedding, bride, groom, matchmaking, vivah',
  authors: [{ name: 'Vivah Matrimony' }],
  openGraph: {
    title: 'Vivah Matrimony - Find Your Perfect Life Partner',
    description: 'Premium Indian matrimonial platform to find your soulmate.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-ivory-light via-white to-accent-200 antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
