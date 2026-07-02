// FILE: src/app/dashboard/layout.tsx
'use client';
import { StoreProvider } from '@/store';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-page text-text">
        <StoreProvider>
          <div className="flex">
            <aside className="sidebar">
              {/* Sidebar navigation goes here */}
            </aside>
            <main className="flex-1 p-4">
              <Toaster />
              {children}
            </main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
