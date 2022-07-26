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
									partytown = {
										resolveUrl: function(url) {
											if (url.hostname === "connect.facebook.net") {
												var proxyUrl = new URL('https://cdn.builder.codes/api/v1/js-proxy');
												proxyUrl.searchParams.append('url', url.href);
												proxyUrl.searchParams.append('apiKey', "3d4a6996edc14651ad2f83bfc5f94f63");
												return proxyUrl;
											}
											return url;
										},
										lib: "/_next/static/~partytown/",
										forward: ["fbq", "gtag"]           
									};
								}
							`,
            }}
          />

          <noscript>
            {/* eslint-disable-next-line */}
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
