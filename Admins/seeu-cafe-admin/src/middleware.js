// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/forgot-password', '/reset-password'];
  
  // Is the path public?
  const isPublicPath = publicPaths.includes(pathname);
  
  // Redirect to login if trying to access a protected route without a token
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect to dashboard if trying to access a public route with a token
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Apply to all routes except for static files, api routes, and _next
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};