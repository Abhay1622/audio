'use client';

import React from 'react';
import { Sparkles, Loader2, CheckCircle2, RotateCw } from 'lucide-react';

interface GenerateAudioButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  hasError: boolean;
  disabled: boolean;
}

export const GenerateAudioButton: React.FC<GenerateAudioButtonProps> = ({
  onClick,
  isLoading,
  isSuccess,
  hasError,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide shadow-lg transition-all duration-200 flex items-center justify-center space-x-2.5 cursor-pointer ${
        isLoading
          ? 'bg-violet-500 text-white cursor-wait opacity-90'
          : isSuccess
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
          : hasError
          ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25'
          : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-violet-600/25 hover:shadow-violet-600/35 active:scale-[0.99]'
      } ${disabled && !isLoading ? 'opacity-50 cursor-not-allowed filter grayscale-[30%]' : ''}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating Speech...</span>
        </>
      ) : isSuccess ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          <span>Audio Ready! Click to Regenerate</span>
        </>
      ) : hasError ? (
        <>
          <RotateCw className="w-5 h-5" />
          <span>Retry Generation</span>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 text-violet-200" />
          <span>Generate Audio</span>
        </>
      )}
    </button>
  );
};
