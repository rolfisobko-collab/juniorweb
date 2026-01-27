import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAccessToken } from "@/lib/auth-server"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip middleware for static files, API routes that don't need auth, and auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next()
  }

  // Check if we have a valid access token
  const accessToken = req.cookies.get("tz_access")?.value
  const refreshToken = req.cookies.get("tz_refresh")?.value

  if (!accessToken && !refreshToken) {
    return NextResponse.next()
  }

  try {
    // If we have an access token, verify it
    if (accessToken) {
      await verifyAccessToken(accessToken)
      return NextResponse.next()
    }
  } catch {
    // Access token is invalid, try to refresh
  }

  // Try to refresh the token
  if (refreshToken) {
    try {
      const refreshResponse = await fetch(`${req.nextUrl.origin}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Cookie": req.headers.get("cookie") || "",
        },
      })

      if (refreshResponse.ok) {
        // Refresh was successful, continue with the request
        const response = NextResponse.next()
        
        // Copy the new cookies from the refresh response
        const setCookieHeader = refreshResponse.headers.get("set-cookie")
        if (setCookieHeader) {
          response.headers.set("set-cookie", setCookieHeader)
        }
        
        return response
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
    }
  }

  // If we get here, both tokens are invalid, clear them
  const response = NextResponse.next()
  response.cookies.delete("tz_access")
  response.cookies.delete("tz_refresh")
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}
