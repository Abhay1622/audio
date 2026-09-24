import { NextRequest, NextResponse } from 'next/server';
import { translateSingle } from '@/lib/translate';
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

    const { text, sourceLang, targetLangs } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ success: true, translations: {} });
    }

    const validSource = (sourceLang as SupportedLanguage) || 'hi';
    const targets: SupportedLanguage[] = Array.isArray(targetLangs)
      ? targetLangs
      : (['hi', 'bho', 'en'] as SupportedLanguage[]).filter((l) => l !== validSource);

    const translations: Record<string, string> = {};

    await Promise.all(
      targets.map(async (tl) => {
        try {
          const res = await translateSingle(text, validSource, tl);
          translations[tl] = res;
        } catch (err) {
          console.warn(`Translation error for ${tl}:`, err);
          translations[tl] = text; // Graceful fallback
        }
      })
    );

    return NextResponse.json({
      success: true,
      translations,
      sourceLang: validSource,
    });
  } catch (error: unknown) {
    console.error('Translation Route Error:', error);
    const message = error instanceof Error ? error.message : 'Translation failed.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
