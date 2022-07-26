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
import * as fbq from '@lib/fbpixel';
import '../styles/globals.css';
import { ExternalScripts } from '@components/utils/scripts';

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

    const handleRouteChange = () => {
      fbq.pageview();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
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
