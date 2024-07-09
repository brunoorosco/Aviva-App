import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!session) {
      console.warn(`[WARN] No session found for request to ${req.url}`)
      return NextResponse.redirect(new URL('/', req.url))
    }

    console.log(`[INFO] Session found:`, session)
    return NextResponse.next()
  } catch (error) {
    console.error(
      `[ERROR] Error in middleware for request to ${req.url}:`,
      error
    )
    return NextResponse.redirect(
      new URL(
        `/error?message=${encodeURIComponent(
          'An unexpected error occurred. Please try again later.'
        )}`,
        req.url
      )
    )
  }
}

export const config = {
  matcher: ['/app/:path*']
  // matcher: ['/app/:path*', '/api/protected/:path*']
}
