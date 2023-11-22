import { getToken } from 'next-auth/jwt'
import { NextFetchEvent, NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(
  req: NextRequest,
  ev: NextFetchEvent,
  res: NextResponse
) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (!session) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*']
  // matcher: ['/app/:path*', '/api/protected/:path*']
}
