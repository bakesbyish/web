import { IPaths } from '@interfaces/seo';
import { getBreadCrumbs } from '@lib/seo';
import { URL } from 'config';
import Head from 'next/head';
import Script from 'next/script';

interface IDefaultSeo {
  title?: string;
  description?: string;
  image?: string;
  paths?: IPaths[];
  url?: string;
  disableRobots?: boolean;
}

export const DefaultSeo = (props: IDefaultSeo) => {
  const title = props.title ? `${props.title} | Bakes By Ish` : 'Bakes By Ish';
  const description = props.description
    ? props.description
    : 'The one stope for all your baking needs';
  const image = props.image ? props.image : `${URL}/banner.jpg`;
  const paths = props.paths ? props.paths : null;
  const url = props.url ? `${URL}${props.url}` : URL;
  const robots = props.disableRobots ? true : false;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />

        {/* OpenGraph metatags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content={'Bakes By Ish'} />

        {/* Twitter metatags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@bakesbyish" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* Facebook metatags */}
        <meta property="fb:admins" content="221988029638214" />

        {/* Hide the page from robots */}
        {robots ? <meta name="robots" content="noindex" /> : null}
      </Head>

      {/* Breadcrumbs for Google */}
      {paths ? (
        <Script
          id="google-bread-crumbs"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={getBreadCrumbs(paths, URL)}
        />
      ) : null}
    </>
  );
};
