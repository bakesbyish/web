import Head from 'next/head';
import Script from 'next/script';

interface IMeta {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  price?: string;
  size?: string;
  color?: string;
  slug?: string;
  collectionSlug?: string;
  html?: string;
}

export const Meta = (props: IMeta) => {
  const title = props.title ? props.title : 'Bakes By Ish';
  const description = props.description
    ? props.description
    : 'The one stop for all your baking needs, Island wide delivery or physical shopping at Homagama town';
  const image = props.image ? props.image : '/public/bakesbyish.svg';
  const price: string | null = props.price ? props.price : null;
  const color: string | null = props.color ? props.color : null;
  const size: string | null = props.size ? props.size : null;
  const url: string | null = props.url ? props.url : 'https://bakesbyish.com';
  const slug: string | null = props.slug ? props.slug : null;
  const collectionSlug: string | null = props.collectionSlug
    ? props.collectionSlug
    : null;
  const html: string | null = props.html ? props.html : null;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* For twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@bakesbyish" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {price && (
        <>
          <meta name="twitter:data1" content={price} />
          <meta name="twitter:label1" content="Price" />
        </>
      )}

      {color && (
        <>
          <meta
            name={price ? 'twitter:data2' : 'twitter:data1'}
            content={color}
          />
          <meta
            name={price ? 'twitter:label2' : 'twitter:label1'}
            content="Color"
          />
        </>
      )}

      {price && size && (
        <>
          <meta
            name={color ? 'twitter:data3' : 'twitter:data2'}
            content={size}
          />
          <meta
            name={color ? 'twitter:label3' : 'twitter:label2'}
            content="Size"
          />
        </>
      )}

      {/* Open Graph data */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Bakes By Ish" />

      {/* For Facebook Products */}
      <meta property="fb:admins" content="221988029638214" />
      {slug && <meta property="product:retailer_item_id" content={slug} />}
      {collectionSlug && (
        <meta property="product:item_group_id" content={collectionSlug} />
      )}
      {price && (
        <>
          <meta property="product:price:amount" content={price} />
          <meta property="product:price:currency" content="LKR" />
          <meta property="product:availability" content="in stock" />
        </>
      )}

      {price && (
        <>
          <meta property="og:price:amount" content={price} />
          <meta property="og:price:currency" content="LKR" />
        </>
      )}

      {/* Google rich results */}
      {html && (
        <Script
          id="bakesbyish"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      )}
    </Head>
  );
};
