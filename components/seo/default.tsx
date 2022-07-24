import Head from 'next/head';

interface IDefaultSeo {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  disableRobots?: boolean;
}

const URL = 'https://develop.bakesbyish.com';

export const DefaultSeo = (props: IDefaultSeo) => {
  const title = props.title ? `${props.title} | Bakes By Ish` : 'Bakes By Ish';
  const description = props.description
    ? props.description
    : 'The one stope for all your baking needs';
  const image = props.image ? props.image : `${URL}/banner.webp`;
  const url = props.url ? `${URL}${props.url}` : URL;
  const robots = props.disableRobots ? true : false;

  return (
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
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* Twitter metatags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@bakesbyish" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={url} />

      {/* Facebook metatags */}
      <meta property="fb:admins" content="221988029638214" />

      {/* Hide the page from robots */}
      {robots ? <meta name="robots" content="noindex" /> : null}
    </Head>
  );
};
