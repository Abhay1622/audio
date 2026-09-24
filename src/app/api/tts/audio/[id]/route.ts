import { NextRequest, NextResponse } from 'next/server';
import ttsManager from '@/lib/tts';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return new NextResponse('Audio ID missing', { status: 400 });
  }

  const audioItem = ttsManager.getAudio(id);
  if (!audioItem) {
    return new NextResponse('Audio clip not found or expired', { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Type', audioItem.mimeType);
  headers.set('Content-Length', audioItem.buffer.length.toString());
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'public, max-age=1800, immutable');
  headers.set('Content-Disposition', 'inline; filename="speech.mp3"');

  return new NextResponse(new Uint8Array(audioItem.buffer), {
    status: 200,
    headers,
  });
}
