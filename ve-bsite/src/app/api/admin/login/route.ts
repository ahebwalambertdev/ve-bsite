import { NextRequest, NextResponse } from 'next/server';
import { signAdminSession, ADMIN_COOKIE_NAME, DEFAULT_SESSION_MAX_AGE } from '@/lib/admin/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode } = body;

    const validPasscode = process.env.ADMIN_PASSCODE || 've-admin-2026';
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || 've-kampala-admin-secret-session-salt-2026';

    if (!passcode || typeof passcode !== 'string' || passcode.trim() !== validPasscode.trim()) {
      return NextResponse.json(
        { success: false, error: 'Incorrect admin passcode. Access denied.' },
        { status: 401 }
      );
    }

    // Generate signed token
    const token = await signAdminSession(sessionSecret);

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: DEFAULT_SESSION_MAX_AGE,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
