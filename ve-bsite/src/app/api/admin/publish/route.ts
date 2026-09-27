import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { saveCmsData } from '@/lib/cms/cms-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const result = await saveCmsData(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
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

    // Ping IndexNow to instantly notify Bing, Yandex, Copilot, ChatGPT, Perplexity
    let indexNowStatus = 'skipped';
    try {
      const { submitAllToIndexNow } = await import('@/lib/indexnow');
      const indexResult = await submitAllToIndexNow();
      indexNowStatus = indexResult.success ? 'ok' : `failed (${indexResult.status})`;
    } catch {
      indexNowStatus = 'error';
    }

    return NextResponse.json({
      success: true,
      message: 'Published successfully and site revalidated.',
      data: result.data,
      publishedAt: new Date().toISOString(),
      indexNow: indexNowStatus,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Publish failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
