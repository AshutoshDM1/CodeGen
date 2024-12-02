import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware can be reused in other Next.js projects by:
// 1. Copying this file to your project's root directory
// 2. Adjusting the public paths and matcher config as needed
// 3. Ensuring next-auth is properly configured in your project
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  // Customize these paths based on your project's auth routes
  const isPublicPath = path === "/auth/login" || path === "/auth/register";

  // Get the token from cookies - works with NextAuth.js session
  const token = request.cookies.get("next-auth.session-token")?.value || "";

  // Redirect authenticated users away from auth pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Allow authenticated users to access protected routes
  return NextResponse.next();
}

// Configure protected routes - customize for your project
export const config = {
  matcher: [
    "/",
    "/auth/login", 
    "/auth/register",
    "/settings/:path*",
    "/profile/:path*"
  ]
};
