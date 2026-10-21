import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // If we are accessing an /admin route (but not /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin-session')?.value;
    
    // Check if session exists and is valid
    const session = sessionCookie ? await decrypt(sessionCookie) : null;
    
    if (!session) {
      // Redirect to login if unauthenticated
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
