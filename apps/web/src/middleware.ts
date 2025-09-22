import "server-only";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isVercel =
    process.env.VERCEL === "1" ||
    req.headers.get("host")?.includes(".vercel.app");
  const cookie = isVercel
    ? "__Secure-metapress.session_token"
    : "metapress.session_token";
  const isLoggedIn = !!req.cookies.get(cookie)?.value;

  if (["/signin", "/signup", "/resetpassword"].includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (["/", "/blogs", "/about"].includes(pathname)) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|fonts|models).*)",
  ],
};
