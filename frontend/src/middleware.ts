import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/dashboard", "/courses", "/lessons", "/tests", "/results", "/admin"]
const authRoutes = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("access_token")?.value

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
