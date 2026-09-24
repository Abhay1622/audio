import { SupportedLanguage, TTSGenerateRequest, TTSGenerateResult, TTSProviderStatus, TTSVoice } from '@/types/tts';

export interface ITTSProvider {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  generateSpeech(request: TTSGenerateRequest): Promise<TTSGenerateResult>;
  getSupportedLanguages(): SupportedLanguage[];
  getVoices(language?: SupportedLanguage): Promise<TTSVoice[]>;
  supportsLanguage(language: string): boolean;
  getProviderStatus(): Promise<TTSProviderStatus>;
}
