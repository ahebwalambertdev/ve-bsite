import { NextResponse } from 'next/server';
import { getCmsData } from '@/lib/cms/cms-service';

export async function GET() {
  try {
    const data = await getCmsData();
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve CMS data';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
