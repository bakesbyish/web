import { getBreadCrumbs } from '@lib/seo';
import { URL } from 'config';
import Head from 'next/head';
import Script from 'next/script';

export const SearchSeo = () => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <title>Search</title>
        <meta
          name="description"
          content="Search all the products that you need"
        />
        <link rel="canonical" href={`${URL}/search`} />

        {/* OpenGraph metatags */}
        <meta property="og:title" content="Search" />
        <meta
          property="og:description"
          content="Search all the products that you need"
        />
        <meta property="og:url" content={`${URL}/search`} />
        <meta property="og:image" content={`${URL}/banner.jpg`} />
        <meta property="og:site_name" content={'Bakes By Ish'} />

        {/* Twitter metatags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@bakesbyish" />
        <meta name="twitter:title" content="Search" />
        <meta
          name="twitter:description"
          content="Search all the products that you need"
        />
        <meta name="twitter:image" content={`${URL}/banner.jpg`} />

        {/* Facebook metatags */}
        <meta property="fb:admins" content="221988029638214" />
      </Head>

      {/* Breadcrumbs for google */}
      <Script
        id="google-bread-crumbs"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={getBreadCrumbs(
          [{ name: 'search', url: '/search' }],
          URL
        )}
      />

      {/* Search bar settings for google */}
      <Script
        id="google-search-bar"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
					{
						"@context": "https://schema.org",
						"@type": "WebSite",
						"url": "${URL}",
						"potentialAction": {
							"@type": "SearchAction",
							"target": {
								"@type": "EntryPoint",
								"urlTemplate": "${URL}/search?query={search_term_string}"
							},
							"query-input": "required name=search_term_string"
						}
					}
					`,
        }}
      />
    </>
  );
};
