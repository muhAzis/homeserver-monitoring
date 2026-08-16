import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.AUTH_SECRET_KEY);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_session")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.rewrite(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, SECRET_KEY);
      return NextResponse.next(); 
    } catch (error) {
      const response = NextResponse.rewrite(new URL("/login", request.url));
      response.cookies.delete("auth_session");
      return response;
    }
  }

  if (pathname === "/login" || pathname === "/") {
    if (token) {
      try {
        await jwtVerify(token, SECRET_KEY);
        return NextResponse.rewrite(new URL("/dashboard", request.url));
      } catch (error) {
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/",
  ],
};