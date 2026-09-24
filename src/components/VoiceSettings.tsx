'use client';

import React from 'react';
import { TTSVoice } from '@/types/tts';
import { User, Gauge, Sliders, Server, Sparkles } from 'lucide-react';

interface VoiceSettingsProps {
  voices: TTSVoice[];
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
  selectedProvider: 'edge-tts' | 'google-tts' | 'browser';
  onProviderChange: (provider: 'edge-tts' | 'google-tts' | 'browser') => void;
  disabled?: boolean;
}

const SPEED_PRESETS = [0.75, 1.0, 1.25, 1.5];

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  voices,
  selectedVoiceId,
  onVoiceChange,
  speed,
  onSpeedChange,
  pitch,
  onPitchChange,
  selectedProvider,
  onProviderChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-4 pt-2">
      {/* Voice Selection */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="voice-select"
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase"
          >
            <User className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Voice Model</span>
          </label>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {voices.length} available
          </span>
        </div>

        <div className="relative">
          <select
            id="voice-select"
            value={selectedVoiceId}
            disabled={disabled || voices.length === 0}
            onChange={(e) => onVoiceChange(e.target.value)}
            className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition pr-10 cursor-pointer"
          >
            {voices.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.gender} • {v.accent || v.locale})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Speed Rate Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
            <Gauge className="w-3.5 h-3.5 text-indigo-500" />
            <span>Speech Speed</span>
          </label>
          <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-md border border-violet-200 dark:border-violet-800">
            {speed.toFixed(2)}x
          </span>
        </div>

        {/* Speed preset pills */}
        <div className="grid grid-cols-4 gap-1.5">
          {SPEED_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={disabled}
              onClick={() => onSpeedChange(preset)}
              className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all ${
                Math.abs(speed - preset) < 0.01
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {preset}x
            </button>
          ))}
        </div>

        {/* Fine slider */}
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.05"
          value={speed}
          disabled={disabled}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
          aria-label="Speed slider"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>0.5x Slow</span>
          <span>1.0x Normal</span>
          <span>2.0x Fast</span>
        </div>
      </div>

      {/* Pitch Adjustment (Supported by EdgeTTS) */}
      {selectedProvider === 'edge-tts' && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              <span>Voice Pitch</span>
            </label>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-md border border-violet-200 dark:border-violet-800">
              {pitch > 0 ? `+${pitch}Hz` : pitch < 0 ? `${pitch}Hz` : '0Hz (Default)'}
            </span>
          </div>

          <input
            type="range"
            min="-20"
            max="20"
            step="1"
            value={pitch}
            disabled={disabled}
            onChange={(e) => onPitchChange(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
            aria-label="Pitch slider"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>-20Hz Deeper</span>
            <span>0Hz Neutral</span>
            <span>+20Hz Higher</span>
          </div>
        </div>
      )}

      {/* TTS Engine Provider Selector */}
      <div className="space-y-1.5 pt-1 border-t border-slate-200/80 dark:border-slate-800/80">
        <label
          htmlFor="provider-select"
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase"
        >
          <Server className="w-3.5 h-3.5 text-indigo-500" />
          <span>Speech Engine</span>
        </label>
        <div className="relative">
          <select
            id="provider-select"
            value={selectedProvider}
            disabled={disabled}
            onChange={(e) => onProviderChange(e.target.value as 'edge-tts' | 'google-tts' | 'browser')}
            className="w-full appearance-none px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer pr-8"
          >
            <option value="edge-tts">Edge Neural TTS (High Quality Neural • Recommended)</option>
            <option value="google-tts">Google Translate TTS (Lightweight Fallback)</option>
            <option value="browser">Browser Web Speech API (Client-Side Playback)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
