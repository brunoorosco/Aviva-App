import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 🔥 REDIRECIONA "/" PARA "/login"
  if (pathname === "/") {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 🔒 PROTEGE APENAS ROTA /app/*
  if (pathname.startsWith('/app')) {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*']
}
