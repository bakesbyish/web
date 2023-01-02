import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from 'react-use-cart';
import { BakesbyIshContext } from '@context/context';
import { useUserData } from '@hooks/use-user-data';
import { ProgressBar } from '@components/utils/progress';
import { Toast } from '@components/utils/toast';
import { useRouter } from 'next/router';
import { ExternalScripts } from '@components/utils/scripts';
import * as fbq from '@lib/fbpixel';
import * as gtag from '@lib/gtag';
import '../styles/globals.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const { user, validating, mutate } = useUserData();
  const router = useRouter();

  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    fbq.pageview();

    const handleRouteChange = (url: string) => {
      fbq.pageview();
      gtag.pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <ExternalScripts />

      <BakesbyIshContext.Provider
        value={{
          user,
          validating,
          cartOpen,
          setCartOpen,
          mutate,
        }}
      >
        <ProgressBar />
        <CartProvider>
          <ThemeProvider enableSystem={true} attribute={'class'}>
            <Toast />
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </CartProvider>
      </BakesbyIshContext.Provider>
    </>
  );
}

export default MyApp;
