import "@/styles/globals.css";
import "@xyflow/react/dist/style.css";

import { Session } from "next-auth";
import { SpeedInsights } from "@vercel/speed-insights/next";
// import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
// Layouts
import LayoutPublic from "@/components/Layout/LayoutPublic";
import LayoutApp from "@/components/Layout/LayoutApp";
import LayoutTenant from "@/components/Layout/LayoutTenant";
import LayoutEmpty from "@/components/Layout/LayoutEmpty";

// Componentes
import LoadingScreen from "@/components/LoadingScreen";
import ErrorBoundary from "@/components/ErrorBoundary";

// Types
interface LayoutProps {
  children: React.ReactNode;
}

type LayoutComponent = ({ children }: LayoutProps) => JSX.Element;

// Configuração de layouts
const LAYOUT_CONFIG = {
  public: LayoutPublic,
  app: LayoutApp,
  tenant: LayoutTenant,
  empty: LayoutEmpty,
} as const;

// Rotas que não precisam de autenticação
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/privacy",
  "/terms",
  "/link",
  "/sede/ebook", // Para páginas de download de ebook
];

// Hook personalizado para determinar o layout
function useLayoutSelector(pathname: string): LayoutComponent {
  return useMemo(() => {
    if (pathname === "/app") return LAYOUT_CONFIG.empty;
    if (pathname.startsWith("/app")) return LAYOUT_CONFIG.app;

    // Rota dinâmica tipo /algumaCoisa
    if (/^\/[^/]+$/.test(pathname) && pathname !== "/") {
      return LAYOUT_CONFIG.tenant;
    }

    return LAYOUT_CONFIG.public;
  }, [pathname]);
}


// Hook para verificar se a rota é pública
function useIsPublicRoute(pathname: string): boolean {
  return useMemo(() => {

    // 1. Se está na lista de rotas públicas explícitas
    if (PUBLIC_ROUTES.includes(pathname)) return true;

    // 2. Se for uma rota dinâmica tipo /slug (ex: /link, /aviva, /igreja-x)
    const isTenantRoute = /^\/[^/]+$/.test(pathname) && pathname !== "/";
    if (isTenantRoute) return true;

    return false;
  }, [pathname]);
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const router = useRouter();
  const { pathname } = router;
  const [isLoading, setIsLoading] = useState(false);

  const Layout = useLayoutSelector(pathname);
  const isPublicRoute = useIsPublicRoute(pathname);

  console.log("PATHNAME ATUAL:", pathname, "isPublicRoute:", isPublicRoute);
  // Loading state para navegação
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <ErrorBoundary>
      <Head>
        <title>Aviva-App - Plataforma de Gestão</title>
        <meta name="description" content="Plataforma completa para gestão do seu negócio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content="Aviva-App" />
        <meta property="og:description" content="Plataforma completa para gestão do seu negócio" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aviva-App" />
        <meta name="twitter:description" content="Plataforma completa para gestão do seu negócio" />
      </Head>

      <SessionProvider session={session}>
        <Layout>
          {isPublicRoute ? (
            <Component {...pageProps} />
          ) : (
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          )}
        </Layout>

        {/* Loading overlay durante navegação */}
        {isLoading && <LoadingScreen />}

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </SessionProvider>

      <SpeedInsights />
      {/* <Analytics /> */}
    </ErrorBoundary>
  );
}

// Componente de autenticação otimizado
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "loading") return; // Ainda carregando

    if (status === "unauthenticated") {
      setIsRedirecting(true);
      // Salva a URL atual para redirecionamento pós-login
      const returnUrl = router.asPath;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }
  }, [status, router]);

  if (status === "loading" || isRedirecting) {
    return <LoadingScreen />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}

export default MyApp;
