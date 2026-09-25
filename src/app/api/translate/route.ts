import { NextRequest, NextResponse } from 'next/server';
import { translateAllLanguages } from '@/lib/translate';
import { SupportedLanguage } from '@/types/tts';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { text, sourceLang } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({
        success: true,
        translations: { hi: '', bho: '', hinglish: '', en: '' },
        detectedSource: sourceLang || 'hi',
      });
    }

    const validSource = (sourceLang as SupportedLanguage) || 'hi';
    const result = await translateAllLanguages(text, validSource);

    return NextResponse.json({
      success: true,
      translations: result.translations,
      detectedSource: result.detectedSource,
      requestedSource: validSource,
    });
  } catch (error: unknown) {
    console.error('Translation Route Error:', error);
    const message = error instanceof Error ? error.message : 'Translation failed.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
