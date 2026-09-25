'use client';

import React from 'react';
import { AudioPlayer } from './AudioPlayer';
import { Download, RefreshCw, Trash2, Headphones, Sparkles, CheckCircle2, AlertTriangle, FileAudio } from 'lucide-react';
import { SupportedLanguage } from '@/types/tts';

export interface AudioOutputData {
  audioUrl: string;
  language: SupportedLanguage;
  voiceName: string;
  provider: string;
  duration?: number | null;
  characterCount?: number;
  format: 'mp3' | 'wav';
  createdAt: Date;
}

interface AudioResultCardProps {
  audioData: AudioOutputData | null;
  isGenerating: boolean;
  error: string | null;
  onRegenerate: () => void;
  onClear: () => void;
}

export const AudioResultCard: React.FC<AudioResultCardProps> = ({
  audioData,
  isGenerating,
  error,
  onRegenerate,
  onClear,
}) => {
  const handleDownload = () => {
    if (!audioData) return;
    const a = document.createElement('a');
    a.href = audioData.audioUrl;
    const langSlug = audioData.language === 'hi' ? 'hindi' : audioData.language === 'bho' ? 'bhojpuri' : audioData.language === 'hinglish' ? 'hinglish' : 'english';
    const voiceSlug = (audioData.voiceName || 'voice').toLowerCase().replace(/[^a-z0-9]/g, '-');
    a.download = `voicecraft-${langSlug}-${voiceSlug}.${audioData.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between h-full min-h-[460px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Generated Speech
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audio preview &amp; high quality export
              </p>
            </div>
          </div>

          {audioData && !isGenerating && (
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={onClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                title="Clear audio output"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="mt-6">
          {/* State 1: Generating Loading State */}
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-violet-200 dark:border-violet-900 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-violet-600 dark:text-violet-400 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                Synthesizing Speech...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                Generating natural neural audio with precise pronunciation.
              </p>
            </div>
          )}

          {/* State 2: Error State */}
          {!isGenerating && error && (
            <div className="py-10 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mx-auto flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Audio Generation Failed
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 max-w-sm mx-auto mb-4 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
                {error}
              </p>
              <button
                type="button"
                onClick={onRegenerate}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-500/20 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Generation</span>
              </button>
            </div>
          )}

          {/* State 3: Empty State (No audio generated yet) */}
          {!isGenerating && !error && !audioData && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 flex items-center justify-center mb-4 border border-slate-200/60 dark:border-slate-700/60">
                <FileAudio className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                No Audio Generated Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Enter your Hindi or English text on the left and click{' '}
                <span className="font-semibold text-violet-600 dark:text-violet-400">
                  Generate Audio
                </span>{' '}
                to hear the synthesized voice.
              </p>
            </div>
          )}

          {/* State 4: Audio Ready State */}
          {!isGenerating && !error && audioData && (
            <div className="space-y-4">
              {/* Custom sleek Audio Player */}
              <AudioPlayer src={audioData.audioUrl} autoPlay={true} />

              {/* Metadata Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-medium">VOICE MODEL</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                    {audioData.voiceName}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-medium">LANGUAGE</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                    <span>
                      {audioData.language === 'hi'
                        ? '🇮🇳 Hindi (हिन्दी)'
                        : audioData.language === 'bho'
                        ? '🌾 Bhojpuri (भोजपुरी)'
                        : audioData.language === 'hinglish'
                        ? '🇮🇳 Hinglish (Roman)'
                        : '🌐 English'}
                    </span>
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-medium">FORMAT &amp; ENGINE</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
                    {audioData.format} • {audioData.provider}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-medium">TEXT LENGTH</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {audioData.characterCount || 0} characters
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer when audio is ready */}
      {audioData && !isGenerating && !error && (
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-violet-500/20 flex items-center justify-center space-x-2 transition transform active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Audio ({audioData.format.toUpperCase()})</span>
          </button>

          {/* Regenerate Button */}
          <button
            type="button"
            onClick={onRegenerate}
            className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center justify-center space-x-1.5 transition cursor-pointer"
            title="Regenerate audio"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="sm:hidden">Regenerate</span>
          </button>
        </div>
      )}
    </div>
  );
};
