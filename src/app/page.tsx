'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Hero } from '@/components/Hero';
import { VoiceSettings } from '@/components/VoiceSettings';
import { AudioResultCard, AudioOutputData } from '@/components/AudioResultCard';
import { RecentGenerations } from '@/components/RecentGenerations';
import { SupportedLanguage, TTSVoice, TTSApiResponse } from '@/types/tts';
import { BrowserSpeechClient } from '@/lib/tts/browser-provider';
import { SpeakingEmotion, EMOTION_PROFILES, humanizeSpeechText } from '@/lib/tts/humanizer';
import {
  SlidersHorizontal,
  Sparkles,
  Play,
  RotateCcw,
  Languages,
  CheckCircle2,
  Loader2,
  Trash2,
  Volume2,
  Wand2,
  Clipboard,
  RotateCw
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

const DEFAULT_HINGLISH_VOICES: TTSVoice[] = [
  {
    id: 'hinglish-IN-NeerjaNeural',
    name: 'Neerja (Hinglish)',
    friendlyName: 'Neerja Expressive (Neural) - Hinglish Female',
    language: 'hinglish',
    locale: 'en-IN',
    gender: 'Female',
    provider: 'edge-tts',
    accent: 'Hinglish (India)',
    isDefault: true,
  },
  {
    id: 'hinglish-IN-PrabhatNeural',
    name: 'Prabhat (Hinglish)',
    friendlyName: 'Prabhat (Neural) - Hinglish Male',
    language: 'hinglish',
    locale: 'en-IN',
    gender: 'Male',
    provider: 'edge-tts',
    accent: 'Hinglish (India)',
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
    id: 'en-GB-SoniaNeural',
    name: 'Sonia (Neural)',
    friendlyName: 'Sonia - UK English Female',
    language: 'en',
    locale: 'en-GB',
    gender: 'Female',
    provider: 'edge-tts',
    accent: 'UK English',
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
  { label: string; subLabel: string; flag: string; sample: string; badge: string }
> = {
  hi: {
    label: 'Hindi',
    subLabel: 'हिन्दी',
    flag: '🇮🇳',
    sample: 'नमस्ते! आपका बहुत-बहुत स्वागत है... वॉइसक्राफ्ट में। आज का दिन सचमुच बहुत सुंदर है!',
    badge: 'Devanagari',
  },
  bho: {
    label: 'Bhojpuri',
    subLabel: 'भोजपुरी',
    flag: '🌾',
    sample: 'प्रणाम! राउर कइसन बानी? VoiceCraft में राउर बहुत-बहुत स्वागत बा... आज के दिन राउर खातिर बहुत बढ़िया होखे!',
    badge: 'Bhojpuri',
  },
  hinglish: {
    label: 'Hinglish',
    subLabel: 'Roman Hindi',
    flag: '🇮🇳',
    sample: 'Namaste! VoiceCraft mein aapka swagat hai... Aaj ka din sach mein bahut achha hai aur voice bilkul natural lag rahi hai!',
    badge: 'Hinglish',
  },
  en: {
    label: 'English',
    subLabel: 'India / US / UK',
    flag: '🌐',
    sample: 'Hello there! Welcome to VoiceCraft... We are excited to generate natural-sounding human speech for you today!',
    badge: 'English',
  },
};

const LANGUAGES_ORDER: SupportedLanguage[] = ['hi', 'bho', 'hinglish', 'en'];

export default function Home() {
  // Synchronized multi-language text state across all tabs
  const [texts, setTexts] = useState<Record<SupportedLanguage, string>>({
    hi: LANGUAGE_METADATA.hi.sample,
    bho: LANGUAGE_METADATA.bho.sample,
    hinglish: LANGUAGE_METADATA.hinglish.sample,
    en: LANGUAGE_METADATA.en.sample,
  });

  // Active language tab in the single editor
  const [activeLang, setActiveLang] = useState<SupportedLanguage>('hi');
  const [autoTranslate, setAutoTranslate] = useState<boolean>(true);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [detectedDiff, setDetectedDiff] = useState<{ detected: SupportedLanguage; suggestedText: string } | null>(null);

  // Settings & Emotion Controls
  const [voices, setVoices] = useState<TTSVoice[]>(DEFAULT_HINDI_VOICES);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('hi-IN-SwaraNeural');
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(0);
  const [selectedProvider, setSelectedProvider] = useState<'edge-tts' | 'google-tts' | 'browser'>('edge-tts');
  const [selectedEmotion, setSelectedEmotion] = useState<SpeakingEmotion>('natural');
  const [naturalPause, setNaturalPause] = useState<boolean>(true);

  // Generation & Audio Output states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [audioOutput, setAudioOutput] = useState<AudioOutputData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AudioOutputData[]>([]);

  // Ref for debouncing auto-translate
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load voices whenever activeLang or provider changes
  const loadVoices = useCallback(async (lang: SupportedLanguage, provider: string) => {
    if (provider === 'browser') {
      const bVoices = BrowserSpeechClient.getVoices(lang === 'hinglish' ? 'en' : lang);
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

    let fallbackList = DEFAULT_HINDI_VOICES;
    if (lang === 'bho') fallbackList = DEFAULT_BHOJPURI_VOICES;
    else if (lang === 'hinglish') fallbackList = DEFAULT_HINGLISH_VOICES;
    else if (lang === 'en') fallbackList = DEFAULT_ENGLISH_VOICES;

    setVoices(fallbackList);
    setSelectedVoiceId(fallbackList[0].id);
  }, []);

  useEffect(() => {
    loadVoices(activeLang, selectedProvider);
  }, [activeLang, selectedProvider, loadVoices]);

  // Core live auto-translation from the active editor tab to other tabs
  const performTranslation = async (textToTranslate: string, currentTab: SupportedLanguage) => {
    if (!textToTranslate.trim()) return;

    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTranslate.trim(),
          sourceLang: currentTab,
        }),
      });
      const data = await res.json();
      if (data.success && data.translations) {
        setTexts((prev) => {
          const next = { ...prev };
          // Populate all other tabs with their translated versions
          for (const [langKey, val] of Object.entries(data.translations)) {
            if (langKey !== currentTab && typeof val === 'string' && val.trim().length > 0) {
              next[langKey as SupportedLanguage] = val;
            }
          }
          return next;
        });

        // If the pasted script clearly belongs to another language, offer quick 1-click conversion
        if (data.detectedSource && data.detectedSource !== currentTab && data.translations[currentTab]) {
          setDetectedDiff({
            detected: data.detectedSource,
            suggestedText: data.translations[currentTab],
          });
        } else {
          setDetectedDiff(null);
        }
      }
    } catch (err) {
      console.warn('Auto translation warning:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTextChange = (newText: string) => {
    setTexts((prev) => ({ ...prev, [activeLang]: newText }));

    if (!autoTranslate) return;

    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current);
    }

    if (!newText.trim()) return;

    translationTimeoutRef.current = setTimeout(() => {
      performTranslation(newText, activeLang);
    }, 450);
  };

  // Quick insertion helpers for human pauses and breaths in active tab
  const handleInsertPause = (pauseSymbol: string) => {
    setTexts((prev) => {
      const current = prev[activeLang] || '';
      return {
        ...prev,
        [activeLang]: current ? `${current.trim()}${pauseSymbol} ` : `${pauseSymbol} `,
      };
    });
    textareaRef.current?.focus();
  };

  const handleHumanizeCurrentText = () => {
    setTexts((prev) => {
      const current = prev[activeLang] || '';
      const humanized = humanizeSpeechText(current, activeLang, selectedEmotion);
      return {
        ...prev,
        [activeLang]: humanized,
      };
    });
    textareaRef.current?.focus();
  };

  const handleClearActive = () => {
    setTexts((prev) => ({ ...prev, [activeLang]: '' }));
    textareaRef.current?.focus();
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          const combined = texts[activeLang] ? `${texts[activeLang]} ${clipText}` : clipText;
          setTexts((prev) => ({ ...prev, [activeLang]: combined }));
          if (autoTranslate) {
            if (translationTimeoutRef.current) clearTimeout(translationTimeoutRef.current);
            performTranslation(combined, activeLang);
          }
        }
      }
    } catch {
      // Permission denied
    }
  };

  const handleLoadSample = () => {
    handleTextChange(LANGUAGE_METADATA[activeLang].sample);
  };

  // Immediate Generate & Play handler for the active language tab
  const handleGenerateAndPlay = async () => {
    const textToSpeak = texts[activeLang];
    if (!textToSpeak || textToSpeak.trim().length === 0) {
      setError(`Please enter some text in ${LANGUAGE_METADATA[activeLang].label} before generating audio.`);
      return;
    }
    if (textToSpeak.length > 5000) {
      setError(`Text exceeds the 5,000 character limit.`);
      return;
    }

    setIsGenerating(true);
    setIsSuccess(false);
    setError(null);

    // Pick appropriate voice for activeLang
    let voiceId = selectedVoiceId;
    if (activeLang === 'hi' && !voiceId.startsWith('hi-IN')) {
      voiceId = DEFAULT_HINDI_VOICES[0].id;
    } else if (activeLang === 'bho' && !voiceId.startsWith('bho-IN') && !voiceId.startsWith('hi-IN')) {
      voiceId = DEFAULT_BHOJPURI_VOICES[0].id;
    } else if (activeLang === 'hinglish' && !voiceId.startsWith('hinglish-IN') && !voiceId.startsWith('en-IN')) {
      voiceId = DEFAULT_HINGLISH_VOICES[0].id;
    } else if (activeLang === 'en' && !voiceId.startsWith('en-')) {
      voiceId = DEFAULT_ENGLISH_VOICES[0].id;
    }

    try {
      // Browser Speech Provider
      if (selectedProvider === 'browser') {
        const emotionObj = EMOTION_PROFILES[selectedEmotion];
        const effectiveSpeed = speed * emotionObj.speedMultiplier;
        const effectivePitch = pitch / 20 + 1 + emotionObj.pitchOffset / 20;

        BrowserSpeechClient.speak(
          textToSpeak,
          voiceId,
          effectiveSpeed,
          effectivePitch,
          () => {
            setIsGenerating(false);
            setIsSuccess(true);
          },
          (err) => {
            setError(err.message);
            setIsGenerating(false);
          }
        );

        const browserOutput: AudioOutputData = {
          audioUrl: '',
          language: activeLang,
          voiceName: `Browser Speech (${emotionObj.label})`,
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
          language: activeLang,
          voice: voiceId,
          speed,
          pitch,
          provider: selectedProvider,
          emotion: selectedEmotion,
          naturalPause,
        }),
      });

      const data: TTSApiResponse = await res.json();

      if (!res.ok || !data.success || !data.audioUrl) {
        throw new Error(data.error?.message || 'Speech generation failed. Please try again.');
      }

      const activeVoice = voices.find((v) => v.id === voiceId);
      const emotionLabel = EMOTION_PROFILES[selectedEmotion].label;
      const newOutput: AudioOutputData = {
        audioUrl: data.audioUrl,
        language: data.language || activeLang,
        voiceName: `${activeVoice ? activeVoice.name : (data.voice || 'Neural Voice')} (${emotionLabel})`,
        provider: data.provider || selectedProvider,
        duration: data.duration,
        characterCount: data.characterCount || textToSpeak.trim().length,
        format: data.format || 'mp3',
        createdAt: new Date(),
      };

      setAudioOutput(newOutput);
      setHistory((prev) => [newOutput, ...prev.slice(0, 9)]);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during audio generation.';
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const activeMeta = LANGUAGE_METADATA[activeLang];
  const charCount = texts[activeLang].length;

  return (
    <div className="flex-1 py-4 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <Hero />

      {/* Main Two-Column Generator Workspace */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: ONE Unified Editor Input Area with Language Tab Switcher */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
            {/* Top Language Tab Switcher Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-wide uppercase flex items-center space-x-1.5">
                  <Languages className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  <span>Select Voice &amp; Language Tab</span>
                </label>

                {/* Auto-translate live toggle */}
                <div className="flex items-center space-x-2 text-xs">
                  {isTranslating && (
                    <span className="flex items-center space-x-1 text-violet-600 dark:text-violet-400 font-medium animate-pulse text-[11px]">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Syncing translations...</span>
                    </span>
                  )}
                  <label className="flex items-center space-x-1.5 cursor-pointer select-none text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={autoTranslate}
                      onChange={(e) => setAutoTranslate(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-violet-600 accent-violet-600 cursor-pointer"
                    />
                    <span>Live Auto-Translate</span>
                  </label>
                </div>
              </div>

              {/* 4 Sleek Tabs: Hindi, Bhojpuri, Hinglish, English */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                {LANGUAGES_ORDER.map((lang) => {
                  const meta = LANGUAGE_METADATA[lang];
                  const isActive = activeLang === lang;
                  const hasContent = Boolean(texts[lang] && texts[lang].trim().length > 0);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setActiveLang(lang);
                        setDetectedDiff(null);
                      }}
                      className={`relative flex items-center justify-center space-x-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-sm border border-slate-200/80 dark:border-slate-700 ring-1 ring-violet-400/30'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span className="text-sm">{meta.flag}</span>
                      <div className="text-left leading-tight">
                        <div className="flex items-center space-x-1">
                          <span className="block">{meta.label}</span>
                          {hasContent && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"
                              title="Text & voice ready"
                            />
                          )}
                        </div>
                        <span className="text-[10px] font-normal opacity-70 block">
                          {meta.subLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ONE Single Editor Input Container */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 transition shadow-sm overflow-hidden">
              {/* Textarea Header inside Editor */}
              <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-base">{activeMeta.flag}</span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    Editing {activeMeta.label} Text
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-medium">
                    {activeMeta.badge}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-violet-600 border border-slate-200 dark:border-slate-600 text-[11px] font-medium transition"
                  >
                    Load Sample
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">
                    {charCount.toLocaleString()} / 5,000
                  </span>
                </div>
              </div>

              {/* Optional Detected Script Helper Banner */}
              {detectedDiff && (
                <div className="mx-4 my-2.5 p-2.5 rounded-xl bg-violet-50/90 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800/60 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center space-x-2 text-violet-900 dark:text-violet-200">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span>
                      Pasted text is in <strong>{LANGUAGE_METADATA[detectedDiff.detected].label}</strong>. Translations are ready in all other tabs!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTexts((prev) => ({ ...prev, [activeLang]: detectedDiff.suggestedText }));
                      setDetectedDiff(null);
                    }}
                    className="ml-3 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold text-[11px] shadow-sm transition whitespace-nowrap cursor-pointer"
                  >
                    Convert to {activeMeta.label}
                  </button>
                </div>
              )}

              {/* Main Textarea */}
              <textarea
                ref={textareaRef}
                value={texts[activeLang]}
                onChange={(e) => handleTextChange(e.target.value)}
                onPaste={(e) => {
                  if (!autoTranslate) return;
                  const pasted = e.clipboardData?.getData('text');
                  if (pasted && pasted.trim()) {
                    const combined = texts[activeLang] ? `${texts[activeLang]} ${pasted}` : pasted;
                    if (translationTimeoutRef.current) {
                      clearTimeout(translationTimeoutRef.current);
                    }
                    setTimeout(() => {
                      performTranslation(combined, activeLang);
                    }, 50);
                  }
                }}
                placeholder={`Type or paste your text in ${activeMeta.label} (${activeMeta.subLabel})... Other tabs will auto-translate!`}
                rows={7}
                className="w-full p-4 bg-transparent text-slate-800 dark:text-slate-100 text-sm leading-relaxed resize-y focus:outline-none placeholder-slate-400"
              />

              {/* Bottom Human Pause & Breath Toolbar inside Editor */}
              <div className="px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    Natural pauses:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInsertPause(',')}
                    className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] transition cursor-pointer"
                    title="Short conversational comma pause (~0.3s)"
                  >
                    ⏸️ Short (,)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertPause('...')}
                    className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] transition cursor-pointer"
                    title="Thoughtful breath pause (~0.5s)"
                  >
                    💭 Breath (...)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertPause(' —')}
                    className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] transition cursor-pointer"
                    title="Dramatic suspension pause (~0.8s)"
                  >
                    🎭 Dramatic (—)
                  </button>
                  <button
                    type="button"
                    onClick={handleHumanizeCurrentText}
                    className="px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/60 dark:hover:bg-violet-900/60 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-[11px] font-semibold transition flex items-center space-x-1 cursor-pointer"
                    title="Automatically inject natural breathing pauses, clause cadence and punctuation"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Auto-Humanize</span>
                  </button>
                </div>

                <div className="flex items-center space-x-1 text-xs">
                  <button
                    type="button"
                    onClick={handleClearActive}
                    disabled={!texts[activeLang]}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition disabled:opacity-40"
                    title="Clear text"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 transition"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Prominent Primary CTA: Generate & Play Active Language Audio */}
            <button
              type="button"
              disabled={isGenerating || !texts[activeLang].trim()}
              onClick={handleGenerateAndPlay}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide shadow-lg transition-all duration-200 flex items-center justify-center space-x-2.5 cursor-pointer ${
                isGenerating
                  ? 'bg-violet-500 text-white cursor-wait opacity-90'
                  : isSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
                  : !!error
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25'
                  : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-violet-600/25 hover:shadow-violet-600/35 active:scale-[0.99]'
              } ${!texts[activeLang].trim() ? 'opacity-50 cursor-not-allowed filter grayscale-[30%]' : ''}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing {activeMeta.label} Speech...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Audio Ready &amp; Playing! Click to Regenerate</span>
                </>
              ) : !!error ? (
                <>
                  <RotateCw className="w-5 h-5" />
                  <span>Retry Generation</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Generate &amp; Play {activeMeta.label} Audio</span>
                </>
              )}
            </button>

            {/* Expression, Emotion & Voice Settings Drawer */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <SlidersHorizontal className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Expression, Emotion &amp; Voice Settings ({activeMeta.label})
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
                selectedEmotion={selectedEmotion}
                onEmotionChange={setSelectedEmotion}
                naturalPause={naturalPause}
                onNaturalPauseChange={setNaturalPause}
                disabled={isGenerating}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Audio Output & Player Card */}
        <div className="lg:col-span-5 sticky top-24">
          <AudioResultCard
            audioData={audioOutput}
            isGenerating={isGenerating}
            error={error}
            onRegenerate={handleGenerateAndPlay}
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
