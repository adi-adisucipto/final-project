import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  if (!token) {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/storeadmin")
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const role = token.role;
  const isStoreAdmin = token.isStoreAdmin;

  if (pathname.startsWith("/admin") && role !== "super") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (
    pathname.startsWith("/storeadmin") &&
    !(role === "admin" && isStoreAdmin)
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/storeadmin/:path*"],
};
