import { Loader } from '@components/utils/loader';
import { ICart, ICollectionProduct } from '@interfaces/products';
import { ICollection } from '@interfaces/collections';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import Image from 'next/image';
import { CogIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { ReactElement } from 'react';
import { Layout } from '@components/layout/layout';
import { CollectionPagination } from '@components/pagination/collections';
import { sanity } from 'config/sanity';
import { useCart } from 'react-use-cart';
import toast from 'react-hot-toast';
import { DefaultSeo } from '@components/seo/default';
import * as fbq from '@lib/fbpixel';

const LIMIT = 20;

export default function Page(props: {
  page: string;
  totalPages: string;
  products: ICollectionProduct[];
  collections: ICollection;
}) {
  const { page, totalPages, products, collections } = props;
  const { addItem } = useCart();
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
      <DefaultSeo
        title={collections.catergory}
        description={collections.catergoryDescription}
        image={collections.image.url}
        paths={[
          {
            name: 'collections',
            url: '/collections',
          },
          {
            name: `${collections.catergory.toLowerCase()}`,
            url: `/collections/${collections.catergorySlug}`,
          },
        ]}
        url={`/collections/${collections.catergorySlug}`}
      />
      <main className="bg-white dark:bg-gray-800 flex flex-col items-center justify-center py-10 px-5">
        <section className="flex flex-col items-center justify-center gap-2 mb-8 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">
            {collections.catergory}
          </h1>
          <p className="text-sm sm:text-lg break-words text-left sm:text-center max-w-xl">
            {collections.catergoryDescription}
          </p>
        </section>
        <div className="flex items-center justify-center sm:gap-8 flex-wrap max-w-7xl">
          {products?.map((product) => (
            <article key={product.sku} className="group mt-6 sm:mt-0">
              <div className="w-full h-72 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <Link href={`/shop/${product.slug}`} passHref>
                  <a>
                    <Image
                      src={product.image.url}
                      alt={product.title}
                      width={300}
                      height={300}
                      className="w-full h-full object-center object-cover group-hover:opacity-75"
                    />
                  </a>
                </Link>
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <h3 className="mt-4 text-sm text-gray-700 dark:text-white">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                    LKR {product.price?.toLocaleString()}
                  </p>
                </div>

                {product.hasVariants ? (
                  <CogIcon className="w-6 h-6 mt-5" />
                ) : (
                  <ShoppingCartIcon
                    type="button"
                    onClick={() => {
                      const selectedProduct = {
                        id: product.sku.toString(),
                        sku: product.sku,
                        slug: product.slug,
                        name: product.title,
                        url: product.image.url,
                        color: null,
                        size: null,
                        price: product.price,
                      } as ICart;

                      fbq.event('AddToCart', {
                        content_ids: selectedProduct.sku,
                        content_name: selectedProduct.name,
                        content_type: selectedProduct.size,
                        currency: 'LKR',
                        value: selectedProduct.price,
                      });

                      toast(`${product.title} added to cart`);
                      addItem(selectedProduct, 1);
                    }}
                    className="w-6 h-6 mt-5"
                  />
                )}
              </div>
            </article>
          ))}
        </div>

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
  const slugsData = (await sanity.fetch(
    `*[_type == "categories"] | order(_createdAt asc){
				"slug": slug.current
			}`
  )) as {
    slug: string;
  }[];

  const slugs = slugsData.map((slug) => {
    return slug.slug;
  });

  const paths: { params: { collection: string; page: string } }[] = [];

  for (const slug of slugs) {
    const data = (await sanity.fetch(
      `*[_type == "categories" && slug.current == "${slug}"]{
					"count": count(*[_type == "products" && references(^._id)]{title})
				}`
    )) as {
      count: number;
    }[];

    const { count } = data[0];
    const pages =
      count % LIMIT ? Math.floor(count / LIMIT) + 1 : Math.floor(count / LIMIT);

    for (let page = 1; page <= pages; page++) {
      paths.push({
        params: {
          collection: slug,
          page: page.toString(),
        },
      });
    }
  }

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
  const data = (await sanity.fetch(
    `*[_type == "categories" && slug.current == "${collection}"]{
				"products": *[_type == "products" && references(^._id)][${
          (parseInt(page) - 1) * LIMIT
        }...${parseInt(page) * LIMIT}]{
					title,
					"slug": slug.current,
					sku,
					description,
					"image": {
						"url": image.asset -> url
					},
					price,
					"hasVariants": defined(count(productVariants))
				},
				"collections": {
					"catergory": title,
					"catergorySlug": slug.current,
					"catergoryDescription": description,
					"image": {
						"url": image.asset -> url
					}
				},
				"totalProductsInCollection": count(*[_type == "products" && references(^._id)]{title})
			}`
  )) as {
    products: ICollectionProduct[];
    collections: ICollection[];
    totalProductsInCollection: number;
  }[];

  if (!data.length) {
    return {
      notFound: true,
    };
  }

  const { products, collections, totalProductsInCollection } = data[0];
  const totalPages =
    totalProductsInCollection % LIMIT
      ? Math.floor(totalProductsInCollection / LIMIT) + 1
      : Math.floor(totalProductsInCollection / LIMIT);

  if (!products.length) {
    return {
      redirect: {
        destination: `/collections/${collection}/${totalPages}`,
        permanent: false,
      },
    };
  }

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
