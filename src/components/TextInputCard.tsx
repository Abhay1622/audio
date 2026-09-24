'use client';

import React, { useRef } from 'react';
import { Trash2, Clipboard, BookOpen, AlertCircle } from 'lucide-react';

interface TextInputCardProps {
  text: string;
  onTextChange: (text: string) => void;
  maxLimit?: number;
  disabled?: boolean;
}

const SAMPLE_TEXT_HI = 'नमस्ते! आपका स्वागत है वॉइसक्राफ्ट में। आज का दिन बहुत सुंदर है और तकनीक हमारे जीवन को आसान बना रही है।';
const SAMPLE_TEXT_BHO = 'प्रणाम! राउर कइसन बानी? VoiceCraft में राउर बहुत-बहुत स्वागत बा। आज के दिन राउर खातिर बहुत बढ़िया होखे।';
const SAMPLE_TEXT_EN = 'Hello! Welcome to VoiceCraft. This application generates natural-sounding Hindi, Bhojpuri, and English speech using free AI technology.';

export const TextInputCard: React.FC<TextInputCardProps> = ({
  text,
  onTextChange,
  maxLimit = 5000,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charCount = text.length;
  const isOverLimit = charCount > maxLimit;
  const isNearLimit = charCount > maxLimit * 0.9;

  const handleClear = () => {
    onTextChange('');
    textareaRef.current?.focus();
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          onTextChange(text ? `${text} ${clipText}` : clipText);
        }
      }
    } catch {
      // Browser clipboard permission denied or not supported; user can use Ctrl+V
    }
  };

  const handleSample = (sample: string) => {
    onTextChange(sample);
    textareaRef.current?.focus();
  };

  return (
    <div className="space-y-2">
      {/* Header with Title and Quick Sample Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor="speech-text"
          className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1.5"
        >
          <span>Enter Your Text</span>
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
            (Hindi, Bhojpuri or English)
          </span>
        </label>

        {/* Sample text buttons */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Load sample:
          </span>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleSample(SAMPLE_TEXT_HI)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/60 dark:text-violet-300 dark:hover:bg-violet-900/60 border border-violet-200/80 dark:border-violet-800/60 transition cursor-pointer"
          >
            🇮🇳 Hindi
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleSample(SAMPLE_TEXT_BHO)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/60 transition cursor-pointer"
          >
            🌾 Bhojpuri
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleSample(SAMPLE_TEXT_EN)}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/60 transition cursor-pointer"
          >
            🌐 English
          </button>
        </div>
      </div>

      {/* Main Textarea Container */}
      <div
        className={`relative rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 ${
          isOverLimit
            ? 'border-rose-400 ring-2 ring-rose-200 dark:ring-rose-950'
            : 'border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 shadow-sm'
        }`}
      >
        <textarea
          id="speech-text"
          ref={textareaRef}
          value={text}
          disabled={disabled}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Type or paste your text here (Hindi Unicode or English)..."
          rows={6}
          className="w-full p-4 rounded-2xl bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base leading-relaxed resize-y focus:outline-none disabled:opacity-50"
          aria-describedby="char-count"
        />

        {/* Bottom Toolbar inside card */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-b-2xl border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={disabled || !text}
              onClick={handleClear}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={handlePaste}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition"
              title="Paste text from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>
          </div>

          {/* Character counter */}
          <div
            id="char-count"
            className={`text-xs font-mono font-medium px-2 py-0.5 rounded-md ${
              isOverLimit
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold'
                : isNearLimit
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {charCount.toLocaleString()} / {maxLimit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Validation warning */}
      {isOverLimit && (
        <div className="flex items-center space-x-2 text-xs font-medium text-rose-600 dark:text-rose-400 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            Text exceeds the maximum limit of {maxLimit.toLocaleString()} characters by{' '}
            {(charCount - maxLimit).toLocaleString()} characters. Please shorten your input.
          </span>
        </div>
      )}
    </div>
  );
};
