'use client';

import React from 'react';
import { SupportedLanguage } from '@/types/tts';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
        Select Language
      </label>
      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        {/* Hindi Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onLanguageChange('hi')}
          className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            selectedLanguage === 'hi'
              ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-pressed={selectedLanguage === 'hi'}
        >
          <span className="text-base" role="img" aria-label="India Flag">
            🇮🇳
          </span>
          <div className="text-left leading-tight">
            <span className="block text-xs sm:text-sm">Hindi</span>
            <span className="text-[10px] font-normal opacity-80">हिन्दी</span>
          </div>
        </button>

        {/* Bhojpuri Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onLanguageChange('bho')}
          className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            selectedLanguage === 'bho'
              ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-pressed={selectedLanguage === 'bho'}
        >
          <span className="text-base" role="img" aria-label="Bhojpuri">
            🌾
          </span>
          <div className="text-left leading-tight">
            <span className="block text-xs sm:text-sm">Bhojpuri</span>
            <span className="text-[10px] font-normal opacity-80">भोजपुरी</span>
          </div>
        </button>

        {/* English Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onLanguageChange('en')}
          className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            selectedLanguage === 'en'
              ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-pressed={selectedLanguage === 'en'}
        >
          <span className="text-base" role="img" aria-label="Globe">
            🌐
          </span>
          <div className="text-left leading-tight">
            <span className="block text-xs sm:text-sm">English</span>
            <span className="text-[10px] font-normal opacity-80">Global</span>
          </div>
        </button>
      </div>
    </div>
  );
};
