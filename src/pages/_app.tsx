import '@/styles/globals.css'
import { Session } from 'next-auth'
import type { AppProps } from 'next/app'
import NextAuthSessionProvider from '@/providers/sessionProvider'
import { useRouter } from 'next/router'
import LayoutPublic from '@/components/Layout/LayoutPublic'
import LayoutApp from '@/components/Layout/LayoutApp'
import LayoutTenant from '@/components/Layout/LayoutTenant'
import LayoutEmpty from '@/components/Layout/LayoutEmpty'

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps<{ session: Session }>) {
  const router = useRouter()
  const { pathname } = router
  let Layout = LayoutPublic

  if (pathname === '/app') {
    Layout = LayoutEmpty
  } else if (pathname.startsWith('/app') === true) {
    Layout = LayoutApp
  } else if (pathname.startsWith('/[slug]') === true) {
    Layout = LayoutTenant
  }
  return (
    <NextAuthSessionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NextAuthSessionProvider>
  )
}

export default MyApp
