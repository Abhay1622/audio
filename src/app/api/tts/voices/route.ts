import { NextRequest, NextResponse } from 'next/server';
import ttsManager from '@/lib/tts';
import { SupportedLanguage } from '@/types/tts';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('language') as SupportedLanguage | null;

    const voices = await ttsManager.getVoices(lang || undefined);

    return NextResponse.json({
      success: true,
      voices,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve voices';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
