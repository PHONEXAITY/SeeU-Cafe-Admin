import { NextResponse } from 'next/server';
import axios from 'axios';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // ดึง token จาก cookies
  const token = request.cookies.get('auth_token')?.value;

  // Public paths ที่ไม่ต้องการการยืนยันตัวตน
  const publicPaths = ['/login', '/forgot-password', '/reset-password'];
  
  // ตรวจสอบว่าเป็น path สาธารณะหรือไม่
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // ถ้าไม่มี token และไม่ได้อยู่ใน path สาธารณะ ให้ redirect ไปยังหน้า login
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ถ้ามี token ตรวจสอบความถูกต้องของ token กับ backend
  if (token) {
    try {
      // เรียก API เพื่อ verify token
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ถ้า token ถูกต้องและอยู่ใน path สาธารณะ ให้ redirect ไปยังหน้า dashboard
      if (response.status === 200 && isPublicPath) {
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    } catch (error) {
      console.error('Token verification failed:', error.response?.data || error.message);
      
      // ถ้า token ไม่ถูกต้อง ลบ cookie และ redirect ไปยังหน้า login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      response.cookies.delete('user');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};