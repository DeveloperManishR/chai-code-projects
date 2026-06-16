import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "better-auth.session_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth API routes to avoid redirect loops
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");

  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.[^?]*$).*)',
    '/(api|trpc)(.*)',
  ],
};
