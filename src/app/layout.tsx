import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'VoiceCraft — Free AI Text to Speech (Hindi & English)',
  description:
    'Generate natural-sounding Hindi and English speech using free, open-source neural speech synthesis. Free to run locally with zero paid API keys.',
  keywords: [
    'Text to Speech',
    'Hindi TTS',
    'English TTS',
    'VoiceCraft',
    'AI Voice Generator',
    'Free TTS',
    'Open Source TTS',
  ],
  authors: [{ name: 'VoiceCraft Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-violet-100 selection:text-violet-900">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-slate-200/80 bg-white/50 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} VoiceCraft. Free &amp; Open Source Speech Synthesis.</p>
            <p className="flex items-center space-x-2">
              <span>Supports Hindi Unicode (हिन्दी) &amp; English</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">100% Free • No API Key</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
