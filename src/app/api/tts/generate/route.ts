import { NextRequest, NextResponse } from 'next/server';
import ttsManager from '@/lib/tts';
import { SupportedLanguage, TTSApiResponse } from '@/types/tts';

export const dynamic = 'force-dynamic';

const MAX_CHAR_LIMIT = 5000;

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json<TTSApiResponse>(
        {
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Request body must be valid JSON.',
          },
        },
        { status: 400 }
      );
    }

    const { text, language, voice, speed = 1.0, pitch = 0, provider, emotion, naturalPause } = body;

    // Validate text
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json<TTSApiResponse>(
        {
          success: false,
          error: {
            code: 'EMPTY_TEXT',
            message: 'Please provide some text to convert into speech.',
          },
        },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();
    if (trimmedText.length > MAX_CHAR_LIMIT) {
      return NextResponse.json<TTSApiResponse>(
        {
          success: false,
          error: {
            code: 'TEXT_TOO_LONG',
            message: `Text exceeds maximum allowed limit of ${MAX_CHAR_LIMIT} characters (current: ${trimmedText.length}).`,
          },
        },
        { status: 400 }
      );
    }

    // Validate language
    if (language !== 'hi' && language !== 'en' && language !== 'bho' && language !== 'hinglish') {
      return NextResponse.json<TTSApiResponse>(
        {
          success: false,
          error: {
            code: 'UNSUPPORTED_LANGUAGE',
            message: `Unsupported language '${language}'. VoiceCraft supports 'hi' (Hindi), 'bho' (Bhojpuri), 'hinglish' (Hinglish), and 'en' (English).`,
          },
        },
        { status: 400 }
      );
    }

    // Validate numeric speed
    const numSpeed = typeof speed === 'number' && !isNaN(speed) ? Math.max(0.5, Math.min(2.0, speed)) : 1.0;
    const numPitch = typeof pitch === 'number' && !isNaN(pitch) ? Math.max(-50, Math.min(50, pitch)) : 0;

    const result = await ttsManager.generateSpeech({
      text: trimmedText,
      language: language as SupportedLanguage,
      voice,
      speed: numSpeed,
      pitch: numPitch,
      provider,
      emotion: typeof emotion === 'string' ? emotion : undefined,
      naturalPause: typeof naturalPause === 'boolean' ? naturalPause : true,
    });

    const audioUrl = `/api/tts/audio/${result.audioId}`;

    return NextResponse.json<TTSApiResponse>({
      success: true,
      audioUrl,
      mimeType: result.mimeType,
      format: result.format,
      language: language as SupportedLanguage,
      voice: result.voiceUsed,
      provider: result.providerUsed,
      duration: result.duration,
      characterCount: trimmedText.length,
    });
  } catch (error: unknown) {
    console.error('TTS Generation API Error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred during audio generation.';
    return NextResponse.json<TTSApiResponse>(
      {
        success: false,
        error: {
          code: 'TTS_GENERATION_FAILED',
          message,
        },
      },
      { status: 500 }
    );
  }
}
