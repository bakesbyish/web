import { gql } from '@apollo/client';
import { Layout } from '@components/layout/layout';
import { client } from 'config/apollo';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { ReactElement } from 'react';
import { IProduct } from '@interfaces/products';
import { Meta } from '@components/seo/metatags';
import { Product } from '@components/products/product';

export default function Slug(props: { product: IProduct }) {
  const { product } = props;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Meta
        title={product.title}
        description={product.description}
        image={product.url}
      />

      <main className="flex flex-col items-center justify-center">
        <Product product={product} />
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

  const { data } = (await client.query({
    query: gql`
      query ($slug: String) {
        products(where: { slug: $slug }) {
          sku
          title
          slug
          price
          image {
            url
          }
          description
          unit
          discountFrom
          discountedPrice
          productVariants {
            name
            price
            discountedFrom
            discountedPrice
            variantImage {
              url
            }
            variantColors {
              color
            }
          }
          productColors {
            color
          }
        }
      }
    `,
    variables: {
      slug,
    },
  })) as {
    data: {
      products: {
        sku: string;
        title: string;
        slug: string;
        price: number;
        image: {
          url: string;
        };
        description: string;
        unit: null | string;
        discountFrom: number | null;
        discountedPrice: number | null;
        productVariants: {
          name: string;
          price: number;
          discountedFrom: number | null;
          discountedPrice: number | null;
          variantImage: {
            url: string;
          } | null;
          variantColors: {
            color: string;
          }[];
        }[];
        productColors: {
          color: string;
        }[];
      }[];
    };
  };

  const product = data.products[0];

  const productVariants: {
    name: string;
    price: number;
		hasDiscounts: boolean;
    discountedFrom: number | null;
    discountedPrice: number | null;
    url: string | null;
    variantColors:
      | {
          color: string;
        }[]
      | [];
  }[] = [];

  product.productVariants.map((variant) => {
    productVariants.push({
      name: variant.name,
      price: variant.price,
      hasDiscounts:
        variant.discountedFrom && variant.discountedPrice ? true : false,
      discountedFrom: variant.discountedFrom || null,
      discountedPrice: variant.discountedPrice || null,
      url: variant.variantImage ? variant.variantImage.url : null,
      variantColors: variant.variantColors,
    });
  });

  return {
    props: {
      product: {
        sku: product.sku,
				slug,
        title: product.title,
        price: product.price,
        url: product.image.url,
        description: product.description,
        unit: product.unit,
        hasDiscounts:
          product.discountFrom && product.discountedPrice ? true : false,
        discountedFrom: product.discountFrom || null,
        discountedPrice: product.discountedPrice || null,
        productVariants,
        productColors: product.productColors,
        hasVariants: product.productVariants.length ? true : false,
        hasColors: product.productColors.length ? true : false,
      } as unknown as IProduct,
    },
  };
};

Slug.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
