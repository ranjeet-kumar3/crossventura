import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. EXCLUDE API ROUTES IMMEDIATELY
  // This ensures NextAuth and other APIs are never blocked by middleware
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 2. Admin Route Protection
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminPath) {
    // Exclude admin-login from protection
    if (pathname === "/admin-login") {
      return NextResponse.next();
    }

    const adminToken = request.cookies.get("admin_token")?.value;

    // DEBUG LOG - Check terminal to see this
    console.log(`[Proxy] Accessing Admin Path: ${pathname}, Token Present: ${!!adminToken}`);

    if (!adminToken) {
      console.log(`[Proxy] No admin token found, redirecting to /admin-login`);
      const url = new URL("/admin-login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 3. Normal User Route Protection
  const nextAuthToken = await getToken({ req: request });
  const customToken = request.cookies.get("token")?.value;
  const isAuthenticated = !!nextAuthToken || !!customToken;

  const protectedRoutes = [
    "/profile",
    "/myorders",
    "/onboarding",
    "/document",
    "/payments",
    "/services",
    "/pricing"
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/profile/:path*",
    "/myorders/:path*",
    "/onboarding/:path*",
    "/document/:path*",
    "/payments/:path*",
    "/services/:path*",
    "/pricing",
    "/pricing/:path*",
  ],
};
