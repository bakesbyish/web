import { gql } from '@apollo/client';
import { Layout } from '@components/layout/layout';
import { Meta } from '@components/seo/metatags';
import { Collections } from '@components/utils/collections-card';
import { Hero } from '@components/utils/hero';
import { Loader } from '@components/utils/loader';
import { Trending } from '@components/utils/trending';
import { ICollectionCard, ICollectionProduct } from '@interfaces/products';
import { client } from 'config/apollo';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { useInView } from 'react-cool-inview';

// Lazy loaded components
const Newsletter = dynamic<any>(
  () => import('@components/utils/newsletter').then((mod) => mod.Newsletter),
  { loading: () => (
		<section className="mb-4 mt-4">
			<Loader />
		</section>
	)}
);

const GeoLocation = dynamic<any>(() => import('@components/utils/map'), {
  loading: () => (
		<section className="mb-4 mt-4">
			<Loader />
		</section>
	),
});

export default function Home(props: {
  trendingProducts: ICollectionProduct[];
  collections: ICollectionCard[];
}) {
  const { trendingProducts, collections } = props;

  const { observe, inView } = useInView({
		rootMargin: "100px 0px",
    onEnter: ({ unobserve }) => unobserve(),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Meta title={'Home'} />

      <main className="flex flex-col items-center justify-center">
        <Hero />
        <Trending trendingProducts={trendingProducts} />
        <Collections collections={collections} />
        <div ref={observe} className="w-full">
					{inView ? (
						<>
							<Newsletter />
							<GeoLocation />
						</>
					) : null}
        </div>
      </main>
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps: GetStaticProps = async () => {
  // Get data for trending products
  const trendingProducts = await client.query({
    query: gql`
      query {
        products(where: { trending: true }, first: 4, orderBy: createdAt_DESC) {
          title
          slug
          sku
          image {
            url
          }
          price
        }
      }
    `,
  });

  // Get data for collections
  const collections = await client.query({
    query: gql`
      query {
        catergories(orderBy: createdAt_DESC, first: 3) {
          catergory
          catergorySlug
          image {
            url
          }
          catergoryDescription
        }
      }
    `,
  });

  return {
    props: {
      trendingProducts: trendingProducts.data?.products,
      collections: collections.data?.catergories,
    },
    revalidate: 10,
  };
};
