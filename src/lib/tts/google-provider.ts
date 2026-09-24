import { ITTSProvider } from './types';
import { SupportedLanguage, TTSGenerateRequest, TTSGenerateResult, TTSProviderStatus, TTSVoice } from '@/types/tts';
import * as googleTTS from 'google-tts-api';

const GOOGLE_VOICES: TTSVoice[] = [
  {
    id: 'google-hi',
    name: 'Google Hindi Voice',
    friendlyName: 'Google Hindi (Standard)',
    language: 'hi',
    locale: 'hi-IN',
    gender: 'Female',
    provider: 'google-tts',
    accent: 'India (Hindi)',
    isDefault: true,
  },
  {
    id: 'google-bho',
    name: 'Google Bhojpuri Voice',
    friendlyName: 'Google Bhojpuri (Devanagari)',
    language: 'bho',
    locale: 'bho-IN',
    gender: 'Female',
    provider: 'google-tts',
    accent: 'India (Bhojpuri)',
    isDefault: true,
  },
  {
    id: 'google-en',
    name: 'Google English Voice',
    friendlyName: 'Google English (Standard)',
    language: 'en',
    locale: 'en-US',
    gender: 'Female',
    provider: 'google-tts',
    accent: 'US / International English',
    isDefault: true,
  },
];

export class GoogleTTSProvider implements ITTSProvider {
  readonly id = 'google-tts';
  readonly name = 'Google Translate Speech';
  readonly description = 'Standard free speech synthesis fallback (No API key required)';

  getSupportedLanguages(): SupportedLanguage[] {
    return ['hi', 'en', 'bho'];
  }

  supportsLanguage(language: string): boolean {
    return language === 'hi' || language === 'en' || language === 'bho';
  }

  async getVoices(language?: SupportedLanguage): Promise<TTSVoice[]> {
    if (!language) {
      return GOOGLE_VOICES;
    }
    return GOOGLE_VOICES.filter((v) => v.language === language);
  }

  async generateSpeech(request: TTSGenerateRequest): Promise<TTSGenerateResult> {
    const { text, language, speed = 1.0 } = request;

    if (!text || text.trim().length === 0) {
      throw new Error('Input text cannot be empty.');
    }

    if (!this.supportsLanguage(language)) {
      throw new Error(`Unsupported language '${language}' for Google TTS.`);
    }

    try {
      const isSlow = speed < 0.9;
      const googleLang = language === 'bho' ? 'hi' : language;
      const results: Array<{ base64: string }> = await googleTTS.getAllAudioBase64(text.trim(), {
        lang: googleLang,
        slow: isSlow,
        host: 'https://translate.google.com',
        timeout: 10000,
      });

      if (!results || results.length === 0) {
        throw new Error('No audio returned from Google TTS service.');
      }

      // Concatenate base64 chunks
      const buffers = results.map((item) => Buffer.from(item.base64, 'base64'));
      const combinedBuffer = Buffer.concat(buffers);

      const voiceUsed = language === 'hi' ? 'google-hi' : 'google-en';

      return {
        audioBuffer: combinedBuffer,
        mimeType: 'audio/mpeg',
        format: 'mp3',
        duration: Math.round((combinedBuffer.length / 4000) * 10) / 10,
        providerUsed: this.id,
        voiceUsed,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`GoogleTTS generation failed: ${errorMessage}`);
    }
  }

  async getProviderStatus(): Promise<TTSProviderStatus> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isAvailable: true,
      supportedLanguages: this.getSupportedLanguages(),
      isDefault: false,
    };
  }
}
