'use client';

import React from 'react';
import { AudioOutputData } from './AudioResultCard';
import { History, Play, Download, Clock } from 'lucide-react';

interface RecentGenerationsProps {
  history: AudioOutputData[];
  onSelect: (item: AudioOutputData) => void;
  onClear: () => void;
}

export const RecentGenerations: React.FC<RecentGenerationsProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Recent Generations (This Session)
          </h3>
          <span className="text-xs text-slate-400 font-medium">({history.length})</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-rose-500 transition"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {history.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onSelect(item)}
            className="p-3 rounded-xl bg-slate-50 hover:bg-violet-50/60 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between cursor-pointer transition group"
          >
            <div className="min-w-0 flex-1 pr-2">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {item.voiceName}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-medium">
                  {item.language === 'hi' ? 'HI' : item.language === 'bho' ? 'BHO' : 'EN'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>• {item.characterCount} chars</span>
              </p>
            </div>

            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 group-hover:bg-violet-600 group-hover:text-white flex items-center justify-center transition shadow-sm"
              title="Load & Play"
            >
              <Play className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
