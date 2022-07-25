import Head from 'next/head';

interface IShopSeo {
  title: string;
  description: string;
  url: string;
  image: string;
  price: number;
  slug: string;
  collection: string | null;
}

export const ShopSeo = (props: IShopSeo) => {
  const { title, description, url, image, price, slug, collection } = props;
  return (
    <Head>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="product:brand" content="Facebook" />
      <meta property="product:availability" content="in stock" />
      <meta property="product:condition" content="new" />
      <meta property="product:price:amount" content={price.toString()} />
      <meta property="product:price:currency" content="LKR" />
      <meta property="product:retailer_item_id" content={slug} />

      {collection ? (
        <meta property="product:item_group_id" content={collection} />
      ) : null}
    </Head>
  );
};
