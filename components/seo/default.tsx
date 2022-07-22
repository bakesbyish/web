import Head from 'next/head';

interface IDefaultSeo {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  disableRobots?: boolean;
}

const URL =
  process.env.NODE_ENV === 'production'
    ? 'https://www.bakesbyish.com'
    : 'https://develop.bakesbyish.com';

export const DefaultSeo = (props: IDefaultSeo) => {
  const title = props.title ? `${props.title} | Bakes By Ish` : 'Bakes By Ish';
  const description = props.description
    ? props.description
    : 'The one stope for all your baking needs';
  const image = props.image ? props.image : `${URL}/bakesbyish.svg`;
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
      <meta property="og:title" content={title} key="ogtitle" />
      <meta property="og:description" content={description} key="ogdesc" />
      <meta property="og:url" content={url} key="ogurl" />
      <meta property="og:image" content={image} key="ogimage" />
      <meta property="og:site_name" content={'Bakes By Ish'} key="ogsitename" />
      <meta property="og:title" content={title} key="ogtitle" />
      <meta property="og:description" content={description} key="ogdesc" />

      {/* Twitter metatags */}
      <meta name="twitter:card" content="summary" key="twcard" />
      <meta name="twitter:creator" content={'@bakesbyish'} key="twhandle" />
      <meta name="twitter:site" content="@bakesbyish" key="twsite" />
      <meta
        name="twitter:description"
        content={description}
        key="twdescription"
      />
      <meta name="twitter:image" content={image} key="twimage" />

      {/* Facebook metatags */}
      <meta property="fb:admins" content="221988029638214" key="fbadmin" />

      {/* Hide the page from robots */}
      {robots ? <meta name="robots" content="noindex" /> : null}
    </Head>
  );
};
