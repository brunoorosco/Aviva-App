import '@/styles/globals.css'
import { Session } from 'next-auth'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import LayoutPublic from '@/components/Layout/LayoutPublic'
import LayoutApp from '@/components/Layout/LayoutApp'
import LayoutTenant from '@/components/Layout/LayoutTenant'
import LayoutEmpty from '@/components/Layout/LayoutEmpty'
import { SessionProvider, useSession } from 'next-auth/react'
import Head from 'next/head'

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps<{ session: Session }>) {
  const router = useRouter()
  const { pathname } = router
  let Layout: ({ children }: { children: React.ReactNode }) => JSX.Element =
    LayoutPublic
  if (pathname === '/app') {
    Layout = LayoutEmpty
  } else if (pathname.startsWith('/app') === true) {
    Layout = LayoutApp
  } else if (pathname.startsWith('/[slug]') === true) {
    Layout = LayoutTenant
  } else if (pathname.startsWith('/sapopemba/links') === true) {
    Layout = LayoutEmpty
  }
  return (
    <>
      <Head>
        <title>Aviva-App</title>
        <meta name='description' content='Descrição da página' />
      </Head>
      <SessionProvider>
        <Layout>
          <Auth>
            <Component {...pageProps} />
          </Auth>
        </Layout>
      </SessionProvider>
      <SpeedInsights />
    </>
  )
}

function Auth({ children }: any) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return children
}
export default MyApp
