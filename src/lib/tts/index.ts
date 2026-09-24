import { ITTSProvider } from './types';
import { EdgeTTSProvider } from './edge-provider';
import { GoogleTTSProvider } from './google-provider';
import { SupportedLanguage, TTSGenerateRequest, TTSGenerateResult, TTSProviderStatus, TTSVoice } from '@/types/tts';
import { randomUUID } from 'crypto';

interface CachedAudio {
  id: string;
  buffer: Buffer;
  mimeType: string;
  createdAt: number;
}

class TTSManager {
  private providers: Map<string, ITTSProvider> = new Map();
  private audioCache: Map<string, CachedAudio> = new Map();
  private readonly CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

  constructor() {
    const edge = new EdgeTTSProvider();
    const google = new GoogleTTSProvider();

    this.providers.set(edge.id, edge);
    this.providers.set(google.id, google);

    // Periodic cleanup of audio cache to prevent memory leaks
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanupCache(), 5 * 60 * 1000);
    }
  }

  private cleanupCache() {
    const now = Date.now();
    for (const [id, item] of this.audioCache.entries()) {
      if (now - item.createdAt > this.CACHE_TTL_MS) {
        this.audioCache.delete(id);
      }
    }
  }

  getProvider(id?: string): ITTSProvider {
    if (id && this.providers.has(id)) {
      return this.providers.get(id)!;
    }
    // Default to EdgeTTS
    return this.providers.get('edge-tts')!;
  }

  async getVoices(language?: SupportedLanguage): Promise<TTSVoice[]> {
    const voices: TTSVoice[] = [];
    for (const provider of this.providers.values()) {
      try {
        const pVoices = await provider.getVoices(language);
        voices.push(...pVoices);
      } catch (err) {
        console.error(`Failed to load voices from provider ${provider.id}:`, err);
      }
    }
    return voices;
  }

  async getProviderStatuses(): Promise<TTSProviderStatus[]> {
    const statuses: TTSProviderStatus[] = [];
    for (const provider of this.providers.values()) {
      try {
        const status = await provider.getProviderStatus();
        statuses.push(status);
      } catch {
        statuses.push({
          id: provider.id,
          name: provider.name,
          description: provider.description,
          isAvailable: false,
          supportedLanguages: provider.getSupportedLanguages(),
          isDefault: provider.id === 'edge-tts',
        });
      }
    }
    return statuses;
  }

  async generateSpeech(request: TTSGenerateRequest): Promise<TTSGenerateResult & { audioId: string }> {
    const primaryProvider = this.getProvider(request.provider);
    let result: TTSGenerateResult;

    try {
      result = await primaryProvider.generateSpeech(request);
    } catch (primaryErr) {
      console.warn(`Primary provider ${primaryProvider.id} failed, attempting fallback:`, primaryErr);

      // Try fallback if primary was edge-tts
      if (primaryProvider.id === 'edge-tts') {
        const fallbackProvider = this.getProvider('google-tts');
        try {
          result = await fallbackProvider.generateSpeech(request);
        } catch (fallbackErr) {
          throw new Error(
            `TTS Generation failed on both primary and fallback providers. Primary: ${primaryErr instanceof Error ? primaryErr.message : String(primaryErr)}. Fallback: ${fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)}`
          );
        }
      } else {
        throw primaryErr;
      }
    }

    // Cache the generated audio
    const audioId = randomUUID();
    this.audioCache.set(audioId, {
      id: audioId,
      buffer: result.audioBuffer,
      mimeType: result.mimeType,
      createdAt: Date.now(),
    });

    return {
      ...result,
      audioId,
    };
  }

  getAudio(id: string): CachedAudio | null {
    const item = this.audioCache.get(id);
    if (!item) return null;
    return item;
  }
}

// Global singleton instance
const globalTTSManager = new TTSManager();
export default globalTTSManager;
