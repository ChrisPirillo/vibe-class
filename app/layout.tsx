import './globals.css';
import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Vibe Class Submissions',
  description: 'Submission and portfolio management for vibe coding class'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
