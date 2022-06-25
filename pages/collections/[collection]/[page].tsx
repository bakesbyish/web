import { gql } from '@apollo/client';
import { Meta } from '@components/seo/metatags';
import { Loader } from '@components/utils/loader';
import { ICollectionProduct } from '@interfaces/products';
import { ICollection } from '@interfaces/collections';
import { client } from 'config/apollo';
import { db } from 'config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import Image from 'next/image';
import { CogIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { ReactElement, useEffect } from 'react';
import { Layout } from '@components/layout/layout';
import { CollectionPagination } from '@components/pagination/collections';

export default function Page(props: {
  page: string;
  totalPages: string;
  products: ICollectionProduct[];
  collections: ICollection;
}) {
  const { page, totalPages, products, collections } = props;
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
    <div>
      <Meta
        title={collections.catergory}
        description={collections.catergoryDescription}
        image={collections.image.url}
      />

      <main className="bg-white dark:bg-gray-800 flex flex-col items-center justify-center min-h-screen">
        {products?.map((product) => (
          <Link href={`/shop/${product.slug}`} key={product.sku} passHref>
            <article className="group">
              <div className="w-full h-72 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={product.image.url}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-center object-cover group-hover:opacity-75"
                />
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <h3 className="mt-4 text-sm text-gray-700 dark:text-white">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                    {product.price}
                  </p>
                </div>

                {product.hasVariants ? (
                  <CogIcon className="w-6 h-6 mt-5" />
                ) : (
                  <ShoppingCartIcon className="w-6 h-6 mt-5" />
                )}
              </div>
            </article>
          </Link>
        ))}

        <CollectionPagination
          page={page}
          totalPages={totalPages}
          collections={collections}
        />
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const collections: string[] = [];
  const collectionData = await client.query({
    query: gql`
      query {
        catergories {
          catergorySlug
        }
      }
    `,
  });
  collectionData.data.catergories.map(
    (data: { __typename: string; catergorySlug: string }) =>
      collections.push(data.catergorySlug)
  );

  const paths: { params: { collection: string; page: string } }[] = [];

  await (async () => {
    for (let index = 0; collections[index]; index++) {
      const collection = collections[index] as string;

      await (async () => {
        let cursor: string | null = null;
        let hasNextPage = true;

        let page = 0;
        while (hasNextPage) {
          const { data } = await client.query({
            query: gql`
              query ($cursor: String, $catergorySlug: String) {
                productsConnection(
                  orderBy: createdAt_DESC
                  where: {
                    catergories_every: {
                      AND: { catergorySlug: $catergorySlug }
                    }
                  }
                  first: 1
                  after: $cursor
                ) {
                  pageInfo {
                    endCursor
                    hasNextPage
                  }
                }
              }
            `,
            variables: {
              cursor,
              catergorySlug: collection,
            },
          });

          page++;
          const docRef = doc(db, 'admin', 'collections', 'map', collection);
          await setDoc(
            docRef,
            {
              [page]: cursor,
            },
            { merge: true }
          );

          paths.push({
            params: {
              collection,
              page: page.toString(),
            },
          });

          cursor = data.productsConnection.pageInfo.endCursor as string;
          hasNextPage = data.productsConnection.pageInfo.hasNextPage;
        }
      })();
    }
  })();

  return {
    paths,
    fallback: 'blocking',
  };
};

interface IParams extends ParsedUrlQuery {
  collection: string;
  page: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { collection, page } = context.params as IParams;

  const cursorsRef = doc(db, 'admin', 'collections', 'map', collection);
  const cursorsData = await getDoc(cursorsRef);
  const cursors = cursorsData.data();

  if (!cursors) {
    return {
      notFound: true,
    };
  }

  const cursor = cursors[page];

  if (cursor === undefined) {
    return {
      notFound: true,
    };
  }

  const { data } = await client.query({
    query: gql`
      query ($cursor: String, $catergorySlug: String) {
        productsConnection(
          orderBy: createdAt_DESC
          where: {
            catergories_every: { AND: { catergorySlug: $catergorySlug } }
          }
          first: 1
          after: $cursor
        ) {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              title
              slug
              sku
              description
              image {
                url
              }
              price
              productVariants {
                id
              }
            }
          }
        }
      }
    `,
    variables: {
      cursor,
      catergorySlug: collection,
    },
  });

  const productsData = data.productsConnection.edges;

  if (!productsData) {
    return {
      notFound: true,
    };
  }

  const products: ICollectionProduct[] = [];
  productsData.map((product: { node: ICollectionProduct }) => {
    products.push({
      title: product.node.title,
      slug: product.node.slug,
      sku: product.node.sku,
      image: {
        url: product.node.image.url,
      },
      price: product.node.price,
      hasVariants: product.node.productVariants?.length ? true : false,
    });
  });

  const catergoryData = await client.query({
    query: gql`
      query ($collection: String) {
        catergories(where: { catergorySlug: $collection }, first: 1) {
          catergory
          catergoryDescription
          image {
            url
          }
        }
      }
    `,
    variables: {
      collection,
    },
  });

  const collections: ICollection = {
    catergory: catergoryData.data.catergories[0].catergory,
    catergorySlug: collection,
    catergoryDescription:
      catergoryData.data.catergories[0].catergoryDescription,
    image: {
      url: catergoryData.data.catergories[0].image.url,
    },
  };

  const totalPageData = await client.query({
    query: gql`
      query ($collection: String) {
        catergories(where: { catergorySlug: $collection }) {
          products {
            id
          }
        }
      }
    `,
    variables: {
      collection,
    },
  });

  const totalPages =
    totalPageData.data.catergories[0].products.length.toString();

  return {
    props: {
      page,
      totalPages,
      products,
      collections,
    },
  };
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
