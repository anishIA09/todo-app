import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const accessToken = req.cookies.get("accessToken");
  const refrshToken = req.cookies.get("refreshToken");

  const token = accessToken || refrshToken;

  const protectedRoute = ["/profile"];

  if (
    (token && pathname === "/auth/signup") ||
    (token && pathname === "/auth/signin")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && protectedRoute.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/signup", "/auth/signin", "/profile"],
};
