import { NextResponse } from 'next/server';
import ttsManager from '@/lib/tts';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const providers = await ttsManager.getProviderStatuses();
    return NextResponse.json({
      success: true,
      providers,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve provider status';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
