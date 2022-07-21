import { Layout } from '@components/layout/layout';
import { Meta } from '@components/seo/metatags';
import { Collections } from '@components/utils/collections-card';
import { Hero } from '@components/utils/hero';
import { Loader } from '@components/utils/loader';
import { Trending } from '@components/utils/trending';
import { ICollectionCard, ICollectionProduct } from '@interfaces/products';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanity, urlFor } from 'config/sanity';
import { collection } from 'firebase/firestore';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement, useState } from 'react';
import { useInView } from 'react-cool-inview';

// Lazy loaded components
const Newsletter = dynamic<any>(
  () => import('@components/utils/newsletter').then((mod) => mod.Newsletter),
  {
    loading: () => (
      <section className="mb-5 mt-5">
        <Loader />
      </section>
    ),
  }
);

const GeoLocation = dynamic<any>(() => import('@components/utils/map'), {
  loading: () => (
    <section className="mb-5 mt-5">
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
    rootMargin: '100px 0px',
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
