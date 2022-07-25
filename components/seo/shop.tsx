import Head from 'next/head';
import Script from 'next/script';

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
    <>
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
      <Script
        id="google-product-content"
        dangerouslySetInnerHTML={{
          __html: `
						{
						"@context": "https://schema.org/",
						"@type": "Product",
						"name": "Executive Anvil",
						"image": [
							"https://example.com/photos/1x1/photo.jpg",
							"https://example.com/photos/4x3/photo.jpg",
							"https://example.com/photos/16x9/photo.jpg"
						 ],
						"description": "Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height.",
						"sku": "0446310786",
						"mpn": "925872",
						"brand": {
							"@type": "Brand",
							"name": "ACME"
						},
						"review": {
							"@type": "Review",
							"reviewRating": {
								"@type": "Rating",
								"ratingValue": "4",
								"bestRating": "5"
							},
							"author": {
								"@type": "Person",
								"name": "Fred Benson"
							}
						},
						"aggregateRating": {
							"@type": "AggregateRating",
							"ratingValue": "4.4",
							"reviewCount": "89"
						},
						"offers": {
							"@type": "Offer",
							"url": "https://example.com/anvil",
							"priceCurrency": "USD",
							"price": "119.99",
							"priceValidUntil": "2020-11-20",
							"itemCondition": "https://schema.org/UsedCondition",
							"availability": "https://schema.org/InStock"
						}
					}
					`,
        }}
      />
    </>
  );
};
