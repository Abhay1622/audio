'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Hero } from '@/components/Hero';
import { VoiceSettings } from '@/components/VoiceSettings';
import { AudioResultCard, AudioOutputData } from '@/components/AudioResultCard';
import { RecentGenerations } from '@/components/RecentGenerations';
import { SupportedLanguage, TTSVoice, TTSApiResponse } from '@/types/tts';
import { BrowserSpeechClient } from '@/lib/tts/browser-provider';
import {
  SlidersHorizontal,
  Sparkles,
  Play,
  RotateCcw,
  Languages,
  CheckCircle2,
  Loader2,
  Trash2,
  ArrowRightLeft,
  Volume2
} from 'lucide-react';

const DEFAULT_HINDI_VOICES: TTSVoice[] = [
  {
    id: 'hi-IN-SwaraNeural',
    name: 'Swara (Neural)',
    friendlyName: 'Swara (Neural) - Hindi Female',
    language: 'hi',
    locale: 'hi-IN',
    gender: 'Female',
    provider: 'edge-tts',
    accent: 'India (Hindi)',
    isDefault: true,
  },
  {
    id: 'hi-IN-MadhurNeural',
    name: 'Madhur (Neural)',
    friendlyName: 'Madhur (Neural) - Hindi Male',
    language: 'hi',
    locale: 'hi-IN',
    gender: 'Male',
    provider: 'edge-tts',
    accent: 'India (Hindi)',
  },
  {
    id: 'google-hi',
    name: 'Google Hindi (Standard)',
    friendlyName: 'Google Translate Hindi',
    language: 'hi',
    locale: 'hi-IN',
    gender: 'Female',
    provider: 'google-tts',
    accent: 'India (Hindi)',
  },
];

const DEFAULT_BHOJPURI_VOICES: TTSVoice[] = [
  {
    id: 'bho-IN-SwaraNeural',
    name: 'Swara (भोजपुरी)',
    friendlyName: 'Swara (Neural) - Bhojpuri Female',
    language: 'bho',
    locale: 'bho-IN',
    gender: 'Female',
    provider: 'edge-tts',
    accent: 'Bhojpuri (भोजपुरी)',
    isDefault: true,
  },
  {
    id: 'bho-IN-MadhurNeural',
    name: 'Madhur (भोजपुरी)',
    friendlyName: 'Madhur (Neural) - Bhojpuri Male',
    language: 'bho',
    locale: 'bho-IN',
    gender: 'Male',
    provider: 'edge-tts',
    accent: 'Bhojpuri (भोजपुरी)',
  },
  {
    id: 'google-bho',
    name: 'Google Bhojpuri (Devanagari)',
    friendlyName: 'Google Bhojpuri',
    language: 'bho',
    locale: 'bho-IN',
    gender: 'Female',
    provider: 'google-tts',
    accent: 'India (Bhojpuri)',
  },
];

const DEFAULT_ENGLISH_VOICES: TTSVoice[] = [
  {
    id: 'en-IN-NeerjaExpressiveNeural',
    name: 'Neerja Expressive (Neural)',
    friendlyName: 'Neerja Expressive - Indian English Female',
    language: 'en',
    locale: 'en-IN',
    gender: 'Female',
    provider: 'edge-tts',
    accent: 'India (English)',
    isDefault: true,
  },
  {
    id: 'en-IN-PrabhatNeural',
    name: 'Prabhat (Neural)',
    friendlyName: 'Prabhat - Indian English Male',
    language: 'en',
    locale: 'en-IN',
    gender: 'Male',
    provider: 'edge-tts',
    accent: 'India (English)',
  },
  {
    id: 'en-US-JennyNeural',
    name: 'Jenny (Neural)',
    friendlyName: 'Jenny - US English Female',
    language: 'en',
    locale: 'en-US',
    gender: 'Female',
    provider: 'edge-tts',
    accent: 'US English',
  },
  {
    id: 'en-US-GuyNeural',
    name: 'Guy (Neural)',
    friendlyName: 'Guy - US English Male',
    language: 'en',
    locale: 'en-US',
    gender: 'Male',
    provider: 'edge-tts',
    accent: 'US English',
  },
  {
    id: 'google-en',
    name: 'Google English (Standard)',
    friendlyName: 'Google Translate English',
    language: 'en',
    locale: 'en-US',
    gender: 'Female',
    provider: 'google-tts',
    accent: 'US / International English',
  },
];

const LANGUAGE_METADATA: Record<
  SupportedLanguage,
  { label: string; subLabel: string; flag: string; sample: string }
> = {
  hi: {
    label: 'Hindi',
    subLabel: 'हिन्दी',
    flag: '🇮🇳',
    sample: 'नमस्ते! आपका स्वागत है वॉइसक्राफ्ट में। आज का दिन बहुत सुंदर है और तकनीक हमारे जीवन को आसान बना रही है।',
  },
  bho: {
    label: 'Bhojpuri',
    subLabel: 'भोजपुरी',
    flag: '🌾',
    sample: 'प्रणाम! राउर कइसन बानी? VoiceCraft में राउर बहुत-बहुत स्वागत बा। आज के दिन राउर खातिर बहुत बढ़िया होखे।',
  },
  en: {
    label: 'English',
    subLabel: 'India / US / UK',
    flag: '🌐',
    sample: 'Hello! Welcome to VoiceCraft. This application generates natural-sounding speech using free AI technology.',
  },
};

export default function Home() {
  // Synchronized multi-language text state
  const [texts, setTexts] = useState<Record<SupportedLanguage, string>>({
    hi: LANGUAGE_METADATA.hi.sample,
    bho: LANGUAGE_METADATA.bho.sample,
    en: LANGUAGE_METADATA.en.sample,
  });

  // Active language selected
  const [activeLang, setActiveLang] = useState<SupportedLanguage>('hi');
  const [autoTranslate, setAutoTranslate] = useState<boolean>(true);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Settings
  const [voices, setVoices] = useState<TTSVoice[]>(DEFAULT_HINDI_VOICES);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('hi-IN-SwaraNeural');
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(0);
  const [selectedProvider, setSelectedProvider] = useState<'edge-tts' | 'google-tts' | 'browser'>('edge-tts');

  // Generation & Audio Output states
  const [generatingLang, setGeneratingLang] = useState<SupportedLanguage | null>(null);
  const [audioOutput, setAudioOutput] = useState<AudioOutputData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AudioOutputData[]>([]);

  // Ref for debouncing auto-translate
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load voices whenever activeLang or provider changes
  const loadVoices = useCallback(async (lang: SupportedLanguage, provider: string) => {
    if (provider === 'browser') {
      const bVoices = BrowserSpeechClient.getVoices(lang);
      if (bVoices.length > 0) {
        setVoices(bVoices);
        setSelectedVoiceId(bVoices[0].id);
        return;
      }
    }

    try {
      const res = await fetch(`/api/tts/voices?language=${lang}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.voices) && data.voices.length > 0) {
          const filtered = data.voices.filter((v: TTSVoice) =>
            provider === 'edge-tts' ? v.provider === 'edge-tts' : provider === 'google-tts' ? v.provider === 'google-tts' : true
          );
          const finalVoices = filtered.length > 0 ? filtered : data.voices;
          setVoices(finalVoices);
          const defaultVoice = finalVoices.find((v: TTSVoice) => v.isDefault) || finalVoices[0];
          setSelectedVoiceId(defaultVoice.id);
          return;
        }
      }
    } catch {
      // Fallback
    }

    const fallbackList = lang === 'hi' ? DEFAULT_HINDI_VOICES : lang === 'bho' ? DEFAULT_BHOJPURI_VOICES : DEFAULT_ENGLISH_VOICES;
    setVoices(fallbackList);
    setSelectedVoiceId(fallbackList[0].id);
  }, []);

  useEffect(() => {
    loadVoices(activeLang, selectedProvider);
  }, [activeLang, selectedProvider, loadVoices]);

  // Real-time live auto-translation
  const handleTextChange = (lang: SupportedLanguage, newText: string) => {
    setTexts((prev) => ({ ...prev, [lang]: newText }));
    setActiveLang(lang);

    if (!autoTranslate) return;

    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current);
    }

    if (!newText.trim()) return;

    translationTimeoutRef.current = setTimeout(async () => {
      setIsTranslating(true);
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: newText.trim(),
            sourceLang: lang,
          }),
        });
        const data = await res.json();
        if (data.success && data.translations) {
          setTexts((prev) => ({
            ...prev,
            ...data.translations,
          }));
        }
      } catch (err) {
        console.warn('Auto translation warning:', err);
      } finally {
        setIsTranslating(false);
      }
    }, 450);
  };

  // Immediate Generate & Play handler for any language
  const handleGenerateAndPlay = async (targetLang: SupportedLanguage) => {
    const textToSpeak = texts[targetLang];
    if (!textToSpeak || textToSpeak.trim().length === 0) {
      setError(`Please enter text for ${LANGUAGE_METADATA[targetLang].label} before generating audio.`);
      return;
    }
    if (textToSpeak.length > 5000) {
      setError(`Text exceeds the 5,000 character limit.`);
      return;
    }

    setGeneratingLang(targetLang);
    setActiveLang(targetLang);
    setError(null);

    // Pick appropriate voice for targetLang
    let voiceId = selectedVoiceId;
    if (targetLang === 'hi' && !voiceId.startsWith('hi-IN')) {
      voiceId = DEFAULT_HINDI_VOICES[0].id;
    } else if (targetLang === 'bho' && !voiceId.startsWith('bho-IN') && !voiceId.startsWith('hi-IN')) {
      voiceId = DEFAULT_BHOJPURI_VOICES[0].id;
    } else if (targetLang === 'en' && !voiceId.startsWith('en-')) {
      voiceId = DEFAULT_ENGLISH_VOICES[0].id;
    }

    try {
      // Browser Speech Provider
      if (selectedProvider === 'browser') {
        BrowserSpeechClient.speak(
          textToSpeak,
          voiceId,
          speed,
          pitch / 20 + 1,
          () => setGeneratingLang(null),
          (err) => {
            setError(err.message);
            setGeneratingLang(null);
          }
        );

        const browserOutput: AudioOutputData = {
          audioUrl: '',
          language: targetLang,
          voiceName: 'Browser Speech Synthesis',
          provider: 'browser-speech',
          duration: null,
          characterCount: textToSpeak.trim().length,
          format: 'wav',
          createdAt: new Date(),
        };
        setAudioOutput(browserOutput);
        return;
      }

      // Backend API call
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak.trim(),
          language: targetLang,
          voice: voiceId,
          speed,
          pitch,
          provider: selectedProvider,
        }),
      });

      const data: TTSApiResponse = await res.json();

      if (!res.ok || !data.success || !data.audioUrl) {
        throw new Error(data.error?.message || 'Speech generation failed. Please try again.');
      }

      const activeVoice = voices.find((v) => v.id === voiceId);
      const newOutput: AudioOutputData = {
        audioUrl: data.audioUrl,
        language: data.language || targetLang,
        voiceName: activeVoice ? activeVoice.name : (data.voice || 'Neural Voice'),
        provider: data.provider || selectedProvider,
        duration: data.duration,
        characterCount: data.characterCount || textToSpeak.trim().length,
        format: data.format || 'mp3',
        createdAt: new Date(),
      };

      setAudioOutput(newOutput);
      setHistory((prev) => [newOutput, ...prev.slice(0, 9)]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during audio generation.';
      setError(msg);
    } finally {
      setGeneratingLang(null);
    }
  };

  const handleClearAll = () => {
    setTexts({
      hi: '',
      bho: '',
      en: '',
    });
    setAudioOutput(null);
    setError(null);
  };

  const handleLoadSample = (lang: SupportedLanguage) => {
    handleTextChange(lang, LANGUAGE_METADATA[lang].sample);
  };

  return (
    <div className="flex-1 py-4 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <Hero />

      {/* Main Two-Column Generator Workspace */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Multi-Language Live Translation Workspace */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
            {/* Top Workspace Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Languages className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Instant Multi-Language Translation &amp; Speech
                </h2>
              </div>

              {/* Controls: Auto-translate toggle & Clear all */}
              <div className="flex items-center space-x-3 text-xs">
                <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoTranslate}
                    onChange={(e) => setAutoTranslate(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600 accent-violet-600 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Live Auto-Translate
                  </span>
                </label>

                {isTranslating && (
                  <span className="flex items-center space-x-1 text-violet-600 dark:text-violet-400 font-medium animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Translating...</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
                  title="Clear all textboxes"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sub-label explaining instant translation */}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Type in <span className="font-semibold text-slate-700 dark:text-slate-200">Hindi</span>,{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">Bhojpuri</span>, or{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">English</span>. It will automatically translate into the others in real-time. Then click{' '}
              <span className="font-semibold text-violet-600 dark:text-violet-400">Generate &amp; Play</span> on any language!
            </p>

            {/* 3 Synchronized Language Editor Cards */}
            <div className="space-y-4">
              {(['hi', 'bho', 'en'] as SupportedLanguage[]).map((lang) => {
                const meta = LANGUAGE_METADATA[lang];
                const isSelected = activeLang === lang;
                const isCurrentlyGenerating = generatingLang === lang;
                const charCount = texts[lang].length;

                return (
                  <div
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`rounded-2xl border p-4 transition-all duration-200 ${
                      isSelected
                        ? 'bg-violet-50/40 dark:bg-violet-950/20 border-violet-400 dark:border-violet-600 ring-2 ring-violet-200 dark:ring-violet-900/50 shadow-sm'
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg" role="img" aria-label={meta.label}>
                          {meta.flag}
                        </span>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                              {meta.label}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              ({meta.subLabel})
                            </span>
                            {isSelected && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Header right: Load Sample & Character Count */}
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadSample(lang);
                          }}
                          className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-violet-600 border border-slate-200 dark:border-slate-600 transition"
                        >
                          Sample
                        </button>
                        <span className="text-[11px] font-mono text-slate-400">
                          {charCount} / 5,000
                        </span>
                      </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                      value={texts[lang]}
                      onChange={(e) => handleTextChange(lang, e.target.value)}
                      placeholder={`Enter text in ${meta.label} (${meta.subLabel})...`}
                      rows={3}
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />

                    {/* Quick Generate & Play CTA on each card */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === 'hi'
                          ? 'Neural Hindi Voice (Swara / Madhur)'
                          : lang === 'bho'
                          ? 'Bhojpuri Devanagari Voice (Swara / Madhur)'
                          : 'English Neural Voice (Neerja / Jenny / Guy)'}
                      </span>

                      <button
                        type="button"
                        disabled={isCurrentlyGenerating || !texts[lang].trim()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateAndPlay(lang);
                        }}
                        className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer ${
                          isCurrentlyGenerating
                            ? 'bg-violet-400 text-white cursor-wait'
                            : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20 active:scale-95'
                        } ${!texts[lang].trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        {isCurrentlyGenerating ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Generating &amp; Playing...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Generate &amp; Play {meta.label}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Voice & Speech Settings Drawer */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <SlidersHorizontal className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Speech &amp; Voice Settings ({LANGUAGE_METADATA[activeLang].label})
                </h3>
              </div>

              <VoiceSettings
                voices={voices}
                selectedVoiceId={selectedVoiceId}
                onVoiceChange={setSelectedVoiceId}
                speed={speed}
                onSpeedChange={setSpeed}
                pitch={pitch}
                onPitchChange={setPitch}
                selectedProvider={selectedProvider}
                onProviderChange={setSelectedProvider}
                disabled={generatingLang !== null}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Audio Output & Player Card */}
        <div className="lg:col-span-5 sticky top-24">
          <AudioResultCard
            audioData={audioOutput}
            isGenerating={generatingLang !== null}
            error={error}
            onRegenerate={() => handleGenerateAndPlay(activeLang)}
            onClear={() => {
              setAudioOutput(null);
              setError(null);
            }}
          />
        </div>
      </div>

      {/* Recent Generations Session History */}
      <RecentGenerations
        history={history}
        onSelect={(item) => setAudioOutput(item)}
        onClear={() => setHistory([])}
      />
    </div>
  );
}
