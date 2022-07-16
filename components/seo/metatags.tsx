import Head from 'next/head';

interface IMeta {
  title?: string;
  description?: string;
  image?: string;
  price?: string;
  size?: string;
  color?: string;
}

export const Meta = (props: IMeta) => {
  let title: string;
  let description: string;
  let image: string;

  props.title ? (title = props.title) : (title = 'Bakes By Ish');
  props.description
    ? (description = props.description)
    : (description =
        'The one stop for all your baking needs, Island wide delivery or physical shopping at Homagama town');
  props.image ? (image = props.image) : (image = '/public/bakesbyish.svg');

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={props.description} />

      {/* For twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@bakesbyish" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {props.price && (
        <>
          <meta name="twitter:data1" content={props.price} />
          <meta name="twitter:label1" content="Price" />
        </>
      )}

      {props.color && (
        <>
          <meta
            name={props.price ? 'twitter:data2' : 'twitter:data1'}
            content={props.color}
          />
          <meta
            name={props.price ? 'twitter:label2' : 'twitter:label1'}
            content="Color"
          />
        </>
      )}

      {props.price && props.size && (
        <>
          <meta
            name={props.color ? 'twitter:data3' : 'twitter:data2'}
            content={props.size}
          />
          <meta
            name={props.color ? 'twitter:label3' : 'twitter:label2'}
            content="Size"
          />
        </>
      )}

      {/* Open Graph data */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Bakes By Ish" />

      {/* For Facebook */}
      <meta property="fb:admins" content="221988029638214" />

      {props.price && (
        <>
          <meta property="og:price:amount" content={props.price} />
          <meta property="og:price:currency" content="LKR" />
        </>
      )}
    </Head>
  );
};
