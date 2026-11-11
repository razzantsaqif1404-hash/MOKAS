import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.AUTH_SECRET || "mokas_dev_secret_change_me_production_super_safe_key_123456";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const SESSION_COOKIE_NAME = "mokas_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lindungi semua rute /dashboard/*
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(sessionCookie, JWT_SECRET);

      // Cek Role di Server: Hanya role 'admin' yang boleh membuka dashboard
      if (payload.roleName !== "admin") {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "unauthorized_role");
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.next();
    } catch (err) {
      // Token tidak valid atau kadaluwarsa
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("error", "session_expired");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

