import Head from 'next/head';

interface IShopSeo {
  sku: string;
  title: string;
  description: string;
  url: string;
  image: string;
  price: number;
  slug: string;
  collection: string | null;
  hearts: number;
}

export const ShopSeo = (props: IShopSeo) => {
  const {
    sku,
    title,
    description,
    url,
    image,
    price,
    slug,
    collection,
    hearts,
  } = props;
  return (
    <Head>
      {/* Facebook */}
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

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@bakesbyish" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {collection ? (
        <meta property="product:item_group_id" content={collection} />
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `
					{
						"@context": "https://schema.org/",
						"@type": "Product",
						"name": "${title}",
						"image": [
							"${image}"
						 ],
						"description": "${description}",
						"sku": "${sku}",
						"brand": {
							"@type": "Brand",
							"name": "ACME"
						},
						"offers": {
							"@type": "Offer",
							"url": "${url}",
							"priceCurrency": "LKR",
							"price": "${price}",
							"itemCondition": "https://schema.org/UsedCondition",
							"availability": "https://schema.org/InStock"
						}
					}
					`,
        }}
        key="google-product-jsonld"
      />
    </Head>
  );
};
