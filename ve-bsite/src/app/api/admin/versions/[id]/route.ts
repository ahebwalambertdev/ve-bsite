import { NextRequest, NextResponse } from 'next/server';
import { getVersionById } from '@/lib/cms/cms-version-service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Version ID required' }, { status: 400 });
    }

    const version = await getVersionById(id);
    if (!version) {
      return NextResponse.json({ success: false, error: 'Version not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, version });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve version';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
