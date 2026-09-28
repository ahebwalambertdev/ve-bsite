import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { rollbackToVersion } from '@/lib/cms/cms-version-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const versionId = body?.versionId;

    if (!versionId || typeof versionId !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid versionId is required' }, { status: 400 });
    }

    const result = await rollbackToVersion(versionId, body.author || 'Admin');

    if (!result.success || !result.data) {
      return NextResponse.json({ success: false, error: result.error || 'Rollback failed' }, { status: 500 });
    }

    // Trigger instant On-Demand ISR Revalidation across the site
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/', 'page');
      revalidatePath('/faq', 'page');
      revalidatePath('/app', 'page');
      revalidatePath('/vendor', 'page');
      revalidatePath('/team', 'page');
      revalidatePath('/about', 'page');
      revalidatePath('/contact', 'page');
      revalidatePath('/press', 'page');
      revalidatePath('/legal/terms', 'page');
      revalidatePath('/legal/privacy', 'page');
      revalidatePath('/journal', 'page');
    } catch {
      // Revalidation error ignored if not in ISR context
    }

    return NextResponse.json({
      success: true,
      message: `Successfully rolled back to version ${versionId}. Site revalidated.`,
      data: result.data,
      version: result.version,
      publishedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Rollback failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
