import React from 'react';
import { Red_Hat_Display } from 'next/font/google';
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import { QueryClientProvider } from '@/providers/QueryClientProvider';

const redHat = Red_Hat_Display({
  subsets: ['latin'],
  variable: '--font-red-hat-display',
});

export const metadata: Metadata = {
  title: "Nyra Admin",
  description: "Admin dashboard for Nyra wallet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={redHat.variable}>
      <body>
        <QueryClientProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
