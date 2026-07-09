import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isAuthRoute = pathname.startsWith('/auth');
    const isDashboardRoute = pathname.startsWith('/dashboard');

    if (isDashboardRoute && !token) {
        // Redirect unauthenticated users from dashboard to login
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (isAuthRoute && token) {
        // Redirect authenticated users from auth pages to dashboard
        return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
