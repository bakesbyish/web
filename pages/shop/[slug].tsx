import { Layout } from '@components/layout/layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ReactElement } from 'react';
import { IProduct } from '@interfaces/products';
import { Product } from '@components/products/product';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'config/firebase';
import { database } from '@interfaces/firestore';
import { Comments } from '@components/comments/comments';
import { sanity } from 'config/sanity';
import { useRouter } from 'next/router';
import { Loader } from '@components/utils/loader';
import { ShopSeo } from '@components/seo/shop';

export default function Slug(props: { product: IProduct; hearts: number }) {
  const { product, hearts } = props;
  const router = useRouter();

  // Display the loader if the page is generated for the first time
  // on user request
  if (router.isFallback) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
      </main>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ShopSeo
        sku={product.sku}
        title={product.title}
        description={product.description}
        url={`/shop/${product.slug}`}
        image={product.url}
        price={product.price}
        slug={product.slug}
        brand={product.brand?.title}
        collection={product.hasCollections ? product.collections[0] : null}
        hearts={hearts}
        paths={[
          {
            name: 'shop',
            url: '/shop',
          },
          {
            name: `${product.title.toLowerCase()}`,
            url: `/shop/${product.slug}`,
          },
        ]}
      />

      <main className="flex flex-col items-center justify-center py-10">
        <Product product={product} hearts={hearts} />
        <Comments slug={product.slug} />
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await sanity.fetch(
    `*[_type == "products"]{
				"params": {
						"slug": slug.current
					}
			}`
  );

  return {
    paths,
    fallback: 'blocking',
  };
};

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as IParams;

  const data = (await sanity.fetch(
    `*[_type == "products" && slug.current == "${slug}"]{
			"product": {
				sku,
				"slug": slug.current,
				title,
				price,
				"url": image.asset -> url,
				description,
				"brand": (brand[] -> { title, "slug": slug.current, "url": image.asset -> url })[0],
				unit,
				"hasDiscounts": discounted,
				"hasCollections": defined(count(categories[] -> slug.current)),
				"collections": categories[] -> slug.current,
				"discountedFrom": discountedFrom,
				"discountedPrice": discountedPrice,
				"productVariants": productVariants[] -> {
					"name": title,
					price,
					"hasDiscounts": discounted,
					"discountedFrom": dicountedFrom,
					"discountedPrice": dicountedPrice,
					"url": image.asset -> url,
					"variantColors": variantColors[] -> {
						"color": colorHex.hex
					}
				},
				"productColors": productColors[] -> {
					"color": colorHex.hex
				},
				"hasColors": defined(count(productColors[] -> colorHex)),
				"hasVariants": defined(count(productVariants[] -> title))
			}
	}`
  )) as { product: IProduct }[];

  if (!data.length) {
    return {
      notFound: true,
    };
  }

  const { product } = data[0];

  // Get hearts of the product from the database
  let hearts = 0;

  const productRef = doc(db, database.products, product.slug);
  const productSnapshot = await getDoc(productRef);

  if (productSnapshot.exists()) {
    hearts = productSnapshot.data().hearts;
  } else {
    hearts = 0;
  }

  return {
    props: {
      product,
      hearts,
    },
  };
};

Slug.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
