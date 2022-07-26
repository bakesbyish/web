import { FB_PIXEL_ID } from '@lib/fbpixel';
import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script
            data-partytown-config
            dangerouslySetInnerHTML={{
              __html: `
								{
									resolveUrl={function(url) {
											if (url.hostname === "connect.facebook.net") {
												var proxyUrl = new URL('https://my-reverse-proxy.com/');
												proxyUrl.searchParams.append('url', url.href);
												return proxyUrl;
											}
											return url;
										},
										forward: [
											"fbq"
										]
									}
							`,
            }}
          />

          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        </Head>

        <body className="scrollbar bg-white text-black dark:bg-gray-800 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
