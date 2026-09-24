export type SupportedLanguage = 'hi' | 'en' | 'bho';

export type VoiceGender = 'Male' | 'Female' | 'Neutral';

export interface TTSVoice {
  id: string;
  name: string;
  friendlyName: string;
  language: SupportedLanguage;
  locale: string;
  gender: VoiceGender;
  provider: 'edge-tts' | 'google-tts' | 'browser';
  accent?: string;
  isDefault?: boolean;
}

export interface TTSGenerateRequest {
  text: string;
  language: SupportedLanguage;
  voice?: string;
  speed?: number; // 0.5 to 2.0, default 1.0
  pitch?: number; // -50 to 50 Hz, default 0
  provider?: 'edge-tts' | 'google-tts' | 'browser';
}

export interface TTSGenerateResult {
  audioBuffer: Buffer;
  mimeType: string;
  format: 'mp3' | 'wav';
  duration?: number | null;
  providerUsed: string;
  voiceUsed: string;
}

export interface TTSApiResponse {
  success: boolean;
  audioUrl?: string;
  audioBase64?: string;
  mimeType?: string;
  format?: 'mp3' | 'wav';
  language?: SupportedLanguage;
  voice?: string;
  provider?: string;
  duration?: number | null;
  characterCount?: number;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

export interface TTSProviderStatus {
  id: string;
  name: string;
  isAvailable: boolean;
  description: string;
  supportedLanguages: SupportedLanguage[];
  isDefault?: boolean;
}
