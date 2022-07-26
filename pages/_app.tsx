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
import Script from 'next/script';
import { pageview } from '@lib/tag-manager';
import * as fbq from '@lib/fbpixel';
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
      pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="worker"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID});
          `,
        }}
      />

      <div id="fb-root"></div>
      <div id="fb-customer-chat" className="fb-customerchat"></div>
      <Script id="fb-messenger" strategy="lazyOnload">
        {`
					var chatbox = document.getElementById('fb-customer-chat');
					chatbox.setAttribute("page_id", "112675403902811");
					chatbox.setAttribute("attribution", "biz_inbox");
					window.fbAsyncInit = function() {
						FB.init({
							xfbml            : true,
							version          : 'v14.0'
						});
					};
					(function(d, s, id) {
						var js, fjs = d.getElementsByTagName(s)[0];
						if (d.getElementById(id)) return;
						js = d.createElement(s); js.id = id;
						js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
						fjs.parentNode.insertBefore(js, fjs);
					}(document, 'script', 'facebook-jssdk'));
				`}
      </Script>

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
