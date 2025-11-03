import "server-only";
import { NextRequest, NextResponse } from "next/server";

const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/reset-password",
  "/forget-password",
];

const routesAllowedWithoutAuth = ["/", "/about", "/contact"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isVercel =
    process.env.VERCEL === "1" ||
    req.headers.get("host")?.includes(".vercel.app");
  const cookie = isVercel
    ? "__Secure-metapress.session_token"
    : "metapress.session_token";
  const isLoggedIn = !!req.cookies.get(cookie)?.value;

  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (authRoutes.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (routesAllowedWithoutAuth.includes(pathname)) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|fonts|models).*)",
  ],
};
