import { Layout } from '@components/layout/layout';
import { DefaultSeo } from '@components/seo/default';
import { Collections } from '@components/utils/collections-card';
import { Hero } from '@components/utils/hero';
import { CardLoader } from '@components/utils/loader';
import { Trending } from '@components/utils/trending';
import { ICollectionCard, ICollectionProduct } from '@interfaces/products';
import { sanity } from 'config/sanity';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { useInView } from 'react-cool-inview';

const Newsletter = dynamic<any>(
  () => import('@components/utils/newsletter').then((mod) => mod.Newsletter),
  {
    loading: () => (
      <div className="flex flex-col items-center justify-center">
        <CardLoader />
      </div>
    ),
  }
);

const GeoLocation = dynamic<any>(() => import('@components/utils/map'), {
  loading: () => (
    <div className="flex flex-col items-center justify-center mb-8">
      <CardLoader />
    </div>
  ),
});

export default function Home(props: {
  trendingProducts: ICollectionProduct[];
  collections: ICollectionCard[];
}) {
  const { trendingProducts, collections } = props;

  const { observe, inView } = useInView({
    onEnter: ({ unobserve }) => unobserve(),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <DefaultSeo />
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
          ) : (
            <>
              <div className="flex flex-col items-center justify-center w-full">
                <CardLoader />
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <CardLoader />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps: GetStaticProps = async () => {
  const trendingProducts = (await sanity.fetch(
    `*[_type == "products" && trending == true] | order(_createdAt desc)[0..3]{
				title,
				"slug": slug.current,
				sku,
				"image": {
					"url": image.asset -> url
				}
			}`
  )) as ICollectionProduct[];

  const collections = (await sanity.fetch(
    `*[_type == "categories"] | order(_createdAt desc)[0..2]{
				"catergory": title,
				"catergorySlug": slug.current,
				"image":{
					"url": image.asset -> url
				},
				"catergoryDescription": description
			}`
  )) as ICollectionCard[];

  return {
    props: {
      trendingProducts,
      collections,
    },
    revalidate: 10,
  };
};
