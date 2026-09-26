import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'Homedine | Eco-Friendly Kitchenware for a Greener Home',
  description: 'Discover thoughtful, planet-prioritizing eco kitchenware, non-toxic cookware, and sustainable dining essentials.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 max-w-[1400px] w-full mx-auto px-3 sm:px-6 py-4">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
