import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement, ReactNode, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from 'react-use-cart';
import { BakesbyIshContext } from '@context/context';
import '../styles/globals.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <BakesbyIshContext.Provider
      value={{
        cartOpen,
        setCartOpen,
      }}
    >
      <CartProvider>
        <ThemeProvider enableSystem={true} attribute={'class'}>
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </CartProvider>
    </BakesbyIshContext.Provider>
  );
}

export default MyApp;
