import { IPaths } from '@interfaces/seo';
import { getBreadCrumbs } from '@lib/seo';
import { URL } from 'config';
import Head from 'next/head';
import Script from 'next/script';

interface IShopSeo {
  sku: string;
  title: string;
  description: string;
  url: string;
  image: string;
  price: number;
  slug: string;
  brand: string | undefined;
  collection: string | null;
  hearts: number;
  paths: IPaths[];
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
    brand,
    collection,
    hearts,
    paths,
  } = props;
  return (
    <>
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
      </Head>

      {hearts ? (
        <>
          {brand ? (
            <Script
              id="google-product-information"
              type="application/ld+json"
              strategy="afterInteractive"
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
							"name": "${brand}"
						},
						"aggregateRating": {
							"@type": "AggregateRating",
							"ratingValue": "5",
							"reviewCount": "${hearts}"
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
          ) : (
            <Script
              id="google-product-information"
              type="application/ld+json"
              strategy="afterInteractive"
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
						"aggregateRating": {
							"@type": "AggregateRating",
							"ratingValue": "5",
							"reviewCount": "${hearts}"
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
          )}
        </>
      ) : (
        <>
          {brand ? (
            <Script
              id="google-product-information"
              strategy="afterInteractive"
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
							"name": "${brand}"
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
          ) : (
            <Script
              id="google-product-information"
              strategy="afterInteractive"
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
          )}
        </>
      )}

      <Script
        id="google-cread-crumbs"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={getBreadCrumbs(paths, URL)}
      />
    </>
  );
};
