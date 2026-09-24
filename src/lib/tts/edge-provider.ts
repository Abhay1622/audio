import { ITTSProvider } from './types';
import { SupportedLanguage, TTSGenerateRequest, TTSGenerateResult, TTSProviderStatus, TTSVoice } from '@/types/tts';
import { EdgeTTS } from '@andresaya/edge-tts';

const KNOWN_VOICES: TTSVoice[] = [
  // Hindi voices
  {
    id: 'hi-IN-SwaraNeural',
    name: 'Swara',
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
    name: 'Madhur',
    friendlyName: 'Madhur (Neural) - Hindi Male',
    language: 'hi',
    locale: 'hi-IN',
    gender: 'Male',
    provider: 'edge-tts',
    accent: 'India (Hindi)',
  },
  // Bhojpuri voices (Devanagari Neural)
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
  // English (India)
  {
    id: 'en-IN-NeerjaExpressiveNeural',
    name: 'Neerja (Expressive)',
    friendlyName: 'Neerja Expressive (Neural) - Indian English Female',
    language: 'en',
    locale: 'en-IN',
    gender: 'Female',
    provider: 'edge-tts',
    accent: 'India (English)',
    isDefault: true,
  },
  {
    id: 'en-IN-PrabhatNeural',
    name: 'Prabhat',
    friendlyName: 'Prabhat (Neural) - Indian English Male',
    language: 'en',
    locale: 'en-IN',
    gender: 'Male',
    provider: 'edge-tts',
    accent: 'India (English)',
  },
  // English (US)
  {
    id: 'en-US-JennyNeural',
    name: 'Jenny',
    friendlyName: 'Jenny (Neural) - US English Female',
    language: 'en',
    locale: 'en-US',
    gender: 'Female',
    provider: 'edge-tts',
    accent: 'US English',
  },
  {
    id: 'en-US-GuyNeural',
    name: 'Guy',
    friendlyName: 'Guy (Neural) - US English Male',
    language: 'en',
    locale: 'en-US',
    gender: 'Male',
    provider: 'edge-tts',
    accent: 'US English',
  },
  // English (UK)
  {
    id: 'en-GB-SoniaNeural',
    name: 'Sonia',
    friendlyName: 'Sonia (Neural) - UK English Female',
    language: 'en',
    locale: 'en-GB',
    gender: 'Female',
    provider: 'edge-tts',
    accent: 'British English',
  },
  {
    id: 'en-GB-RyanNeural',
    name: 'Ryan',
    friendlyName: 'Ryan (Neural) - UK English Male',
    language: 'en',
    locale: 'en-GB',
    gender: 'Male',
    provider: 'edge-tts',
    accent: 'British English',
  },
];

export class EdgeTTSProvider implements ITTSProvider {
  readonly id = 'edge-tts';
  readonly name = 'Edge Neural TTS';
  readonly description = 'Natural neural voices with pitch and speed control (Free, No API Key required)';

  getSupportedLanguages(): SupportedLanguage[] {
    return ['hi', 'en', 'bho'];
  }

  supportsLanguage(language: string): boolean {
    return language === 'hi' || language === 'en' || language === 'bho';
  }

  async getVoices(language?: SupportedLanguage): Promise<TTSVoice[]> {
    if (!language) {
      return KNOWN_VOICES;
    }
    return KNOWN_VOICES.filter((v) => v.language === language);
  }

  async generateSpeech(request: TTSGenerateRequest): Promise<TTSGenerateResult> {
    const { text, language, speed = 1.0, pitch = 0 } = request;

    if (!text || text.trim().length === 0) {
      throw new Error('Input text cannot be empty.');
    }

    if (!this.supportsLanguage(language)) {
      throw new Error(`Unsupported language '${language}' for EdgeTTS.`);
    }

    // Determine target voice
    const availableVoices = KNOWN_VOICES.filter((v) => v.language === language);
    const validVoice = availableVoices.find((v) => v.id === request.voice);
    const voiceToUse: string = validVoice ? validVoice.id : (availableVoices.find((v) => v.isDefault)?.id || availableVoices[0].id);

    // Map Bhojpuri aliases to underlying Devanagari neural models
    let engineVoice = voiceToUse;
    if (engineVoice === 'bho-IN-SwaraNeural') engineVoice = 'hi-IN-SwaraNeural';
    if (engineVoice === 'bho-IN-MadhurNeural') engineVoice = 'hi-IN-MadhurNeural';

    // Format speed rate percentage (e.g. 1.0 => 0%, 1.25 => +25%, 0.75 => -25%)
    const ratePct = Math.round((Math.max(0.5, Math.min(2.0, speed)) - 1.0) * 100);
    const rateStr = `${ratePct >= 0 ? '+' : ''}${ratePct}%`;

    // Format pitch in Hz (e.g. -20 to +20 Hz)
    const clampedPitch = Math.round(Math.max(-50, Math.min(50, pitch)));
    const pitchStr = `${clampedPitch >= 0 ? '+' : ''}${clampedPitch}Hz`;

    try {
      const tts = new EdgeTTS();
      await tts.synthesize(text.trim(), engineVoice, {
        rate: rateStr,
        pitch: pitchStr,
      });

      const audioBuffer = tts.toBuffer();
      if (!audioBuffer || audioBuffer.length === 0) {
        throw new Error('Edge TTS returned an empty audio stream.');
      }

      let duration: number | null = null;
      try {
        duration = tts.getDuration();
      } catch {
        // Fallback estimated duration based on 48kbps MP3 (6000 bytes per second)
        duration = Math.round((audioBuffer.length / 6000) * 10) / 10;
      }

      return {
        audioBuffer,
        mimeType: 'audio/mpeg',
        format: 'mp3',
        duration,
        providerUsed: this.id,
        voiceUsed: voiceToUse,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`EdgeTTS generation failed: ${errorMessage}`);
    }
  }

  async getProviderStatus(): Promise<TTSProviderStatus> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isAvailable: true,
      supportedLanguages: this.getSupportedLanguages(),
      isDefault: true,
    };
  }
}
