import { gql } from '@apollo/client';
import { Layout } from '@components/layout/layout';
import { client } from 'config/apollo';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ReactElement } from 'react';
import { IProduct } from '@interfaces/products';
import { Meta } from '@components/seo/metatags';
import { Product } from '@components/products/product';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'config/firebase';
import { database } from '@interfaces/firestore';
import { Comments } from '@components/comments/comments';
import { sanity } from 'config/sanity';

export default function Slug(props: { product: IProduct; hearts: number }) {
  const { product, hearts } = props;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Meta
        title={product.title}
        description={product.description}
        image={product.url}
        price={product.price.toString()}
      />

      <main className="flex flex-col items-center justify-center py-10">
        <Product product={product} hearts={hearts} />
        <Comments slug={product.slug} />
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = (await client.query({
    query: gql`
      query {
        products {
          slug
        }
      }
    `,
  })) as {
    data: {
      products: {
        slug: string;
      }[];
    };
  };

  const paths = data.products.map((productSlug) => {
    const { slug } = productSlug;
    return {
      params: {
        slug,
      },
    };
  });

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
    `*[_type == "products" && slug.current == "${slug}"] {
		"product": {
			sku,
			"slug": slug.current,
			title,
			price,
			"url": image.asset -> url,
			description,
			unit,
			"hasDiscounts": discounted,
			"discountedFrom": discountedFrom,
			"discountedPrice": discountedPrice,
			"productVariants": *[_type == "variants" && _id in *[_type == "products" && slug.current == "${slug}"].productVariants[]._ref] {
				"variantColors": *[_type == "colors" && _id in *[_type == "variants" && _id in *[_type == "products" && slug.current == "${slug}"].productVariants[]._ref].variantColors[]._ref]{
					"color": colorHex.hex,
		 },
		 "name": title,
		 price,
		 "hasDiscounts": discounted,
		 "discountedFrom": dicountedFrom,
		 "discountedPrice": dicountedPrice,
		 "url": image.asset -> url
		},
		 "productColors": *[_type == "colors" && _id in *[_type == "products" && slug.current == "${slug}"].productColors[]._ref]{
				"color": colorHex.hex,
			},
		}
	}`
  )) as { product: IProduct }[];

  if (!data.length) {
    return {
      notFound: true,
    };
  }

  let { product } = data[0];

  console.log(product.productVariants[1].variantColors);

  // Update the product with the required feilds
  product.hasColors = product.productColors.length ? true : false;
  product.hasVariants = product.productVariants ? true : false;

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
