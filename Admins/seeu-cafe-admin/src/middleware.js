import { NextResponse } from "next/server";
import axios from "axios";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth_token")?.value;

  const publicPaths = ["/login", "/forgot-password", "/reset-password"];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (!token && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
        }/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && isPublicPath) {
        const dashboardUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    } catch (error) {
      console.error(
        "Token verification failed:",
        error.response?.data || error.message
      );

      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      response.cookies.delete("user");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
