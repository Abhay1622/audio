import { SupportedLanguage, TTSVoice } from '@/types/tts';

export class BrowserSpeechClient {
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  static getVoices(language?: SupportedLanguage): TTSVoice[] {
    if (!this.isSupported()) return [];

    const browserVoices = window.speechSynthesis.getVoices();
    const result: TTSVoice[] = [];

    for (const v of browserVoices) {
      const isHindi = v.lang.startsWith('hi');
      const isEnglish = v.lang.startsWith('en');

      if ((!language && (isHindi || isEnglish)) || (language === 'hi' && isHindi) || (language === 'en' && isEnglish)) {
        const langCode: SupportedLanguage = isHindi ? 'hi' : 'en';
        result.push({
          id: `browser-${v.name}`,
          name: v.name,
          friendlyName: `${v.name} (${v.lang})`,
          language: langCode,
          locale: v.lang,
          gender: v.name.toLowerCase().includes('female') ? 'Female' : 'Neutral',
          provider: 'browser',
          accent: v.lang,
        });
      }
    }

    return result;
  }

  static speak(
    text: string,
    voiceName?: string,
    rate: number = 1.0,
    pitch: number = 1.0,
    onEnd?: () => void,
    onError?: (err: Error) => void
  ): { cancel: () => void } {
    if (!this.isSupported()) {
      onError?.(new Error('Browser Speech Synthesis is not supported in this browser.'));
      return { cancel: () => {} };
    }

    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.max(0.5, Math.min(2.0, rate));
    // Web Speech API pitch is 0 to 2, default 1
    utterance.pitch = Math.max(0, Math.min(2, pitch));

    if (voiceName) {
      const actualVoiceName = voiceName.replace(/^browser-/, '');
      const voice = window.speechSynthesis.getVoices().find((v) => v.name === actualVoiceName);
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.onend = () => onEnd?.();
    utterance.onerror = (e) => onError?.(new Error(`Speech synthesis error: ${e.error}`));

    window.speechSynthesis.speak(utterance);

    return {
      cancel: () => window.speechSynthesis.cancel(),
    };
  }

  static cancel() {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}
