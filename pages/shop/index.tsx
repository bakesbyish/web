import { gql } from '@apollo/client';
import { Layout } from '@components/layout/layout';
import { ShopProducts } from '@components/products/shop';
import { Meta } from '@components/seo/metatags';
import { IShopProducts, IShopDataStream } from '@interfaces/products';
import { client } from 'config/apollo';
import { GetStaticProps } from 'next';
import { ReactElement } from 'react';
import { SWRConfig } from 'swr';

export default function Shop(props: {
  fallback: { products: IShopProducts[]; cursor: string; hasNextPage: boolean };
}) {
  const { fallback } = props;

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Meta
        title={'Shop'}
        description={
          'Island wide delivery, for the finest and higest quality cake tools for the lowest possible price'
        }
      />

      <main className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 py-10">
        <SWRConfig value={{ fallback }}>
          <ShopProducts products={fallback.products} />
        </SWRConfig>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = (await client.query({
    query: gql`
      query {
        productsConnection(orderBy: createdAt_DESC, after: null, first: 20) {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              sku
              title
              slug
              price
              image {
                url
              }
              productVariants {
                id
              }
            }
          }
        }
      }
    `,
  })) as IShopDataStream;

  const cursor = data.productsConnection.pageInfo.endCursor;
  const hasNextPage = data.productsConnection.pageInfo.hasNextPage;

  const products: IShopProducts[] = [];

  if (!data.productsConnection.edges.length) {
    return {
      props: {
        fallback: {
          products,
          cursor,
          hasNextPage,
        },
      },
    };
  }

  data.productsConnection.edges.map((productNode) => {
    const { node } = productNode;

    products.push({
      sku: node.sku,
      title: node.title,
      slug: node.slug,
      price: node.price,
      url: node.image.url,
      hasVariants: node.productVariants.length ? true : false,
    });
  });

  return {
    props: {
      fallback: {
        products,
        cursor,
        hasNextPage,
      },
    },
    revalidate: 10,
  };
};

Shop.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
