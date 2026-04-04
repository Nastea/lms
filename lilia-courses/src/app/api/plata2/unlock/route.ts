import { NextResponse } from 'next/server';

function getExpectedPassword(): string {
  return process.env.PLATA2_ACCESS_PASSWORD ?? 'g06d19M26';
}

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'BAD_REQUEST' }, { status: 400 });
  }

  const password = typeof body.password === 'string' ? body.password : '';
  if (password !== getExpectedPassword()) {
    return NextResponse.json({ ok: false, error: 'Parolă incorectă' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('plata2_access', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
