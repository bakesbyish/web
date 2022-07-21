import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement, ReactNode, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from 'react-use-cart';
import { BakesbyIshContext } from '@context/context';
import { useUserData } from '@hooks/use-user-data';
import '../styles/globals.css';
import { ProgressBar } from '@components/utils/progress';
import { Toast } from '@components/utils/toast';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const { user, validating, mutate } = useUserData();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
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
  );
}

export default MyApp;
