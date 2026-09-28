import { NextRequest, NextResponse } from 'next/server';
import { listVersions, recordVersion } from '@/lib/cms/cms-version-service';
import { getCmsData } from '@/lib/cms/cms-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '30', 10);
    const versions = await listVersions(isNaN(limit) ? 30 : limit);
    return NextResponse.json({ success: true, versions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve version history';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const currentData = await getCmsData();
    const version = await recordVersion(currentData, {
      description: body.description || 'Manual Savepoint',
      author: body.author || 'Admin',
      previousData: currentData,
    });

    return NextResponse.json({ success: true, version });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create snapshot';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
