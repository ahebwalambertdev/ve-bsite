import { NextResponse } from 'next/server';
import { submitAllToIndexNow, getAllPublicUrls } from '@/lib/indexnow';

export async function GET() {
  try {
    const urls = await getAllPublicUrls();
    const result = await submitAllToIndexNow();

    return NextResponse.json({
      success: result.success,
      submittedUrlsCount: urls.length,
      urls,
      status: result.status,
      endpoints: result.endpoints,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API IndexNow] Error triggering IndexNow:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
