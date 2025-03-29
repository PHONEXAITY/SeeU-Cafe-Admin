// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // ดึง token จาก localStorage แทนที่ cookies
  // หมายเหตุ: middleware ไม่สามารถเข้าถึง localStorage โดยตรงได้
  // ดังนั้นเราต้องใช้ cookies หรือ headers แทน
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;
  
  // Public paths ที่ไม่ต้องการการยืนยันตัวตน
  const publicPaths = ['/login', '/forgot-password', '/reset-password'];
  
  // ตรวจสอบว่าเป็น path สาธารณะหรือไม่
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // ถ้าไม่มี token และไม่ได้อยู่ใน path สาธารณะ ให้ redirect ไปยังหน้า login
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // ถ้ามี token และอยู่ใน path สาธารณะ ให้ redirect ไปยังหน้า dashboard
  if (token && isPublicPath) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  return NextResponse.next();
}

// ระบุ routes ที่ middleware นี้ควรทำงาน
export const config = {
  matcher: [
    // Apply to all routes except for static files, api routes, and _next
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};