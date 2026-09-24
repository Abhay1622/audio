import React from 'react';
import { Sparkles, CheckCircle2, Mic2, DownloadCloud, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-6 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      {/* Decorative gradient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-gradient-to-r from-violet-400/20 via-indigo-400/20 to-pink-400/20 blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Pill tag */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800/60 text-xs font-semibold mb-4 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
        <span>Free to run locally • Hindi, Bhojpuri &amp; English • Audio Generation</span>
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
        Turn Your Text Into{' '}
        <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Natural Speech
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Generate Hindi, Bhojpuri, and English audio using free and open-source speech technology.
      </p>

      {/* Micro feature pills */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
          <Mic2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          <span className="font-medium">Hindi, Bhojpuri &amp; English Voices</span>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
          <DownloadCloud className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-medium">Direct MP3 Audio Download</span>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium">Zero Paid API Keys Required</span>
        </div>
      </div>
    </section>
  );
};
