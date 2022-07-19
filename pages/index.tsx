import { gql } from '@apollo/client';
import { Layout } from '@components/layout/layout';
import { Meta } from '@components/seo/metatags';
import { Collections } from '@components/utils/collections-card';
import { Hero } from '@components/utils/hero';
import { Loader } from '@components/utils/loader';
import { Trending } from '@components/utils/trending';
import { ICollectionCard, ICollectionProduct } from '@interfaces/products';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { client } from 'config/apollo';
import { sanity, urlFor } from 'config/sanity';
import { collection } from 'firebase/firestore';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
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
  // Get data for trending products
  const trendingProductsData = (await sanity.fetch(
    `*[_type == "products" && trending == true] | order(_createdAt desc)[0..3] {
				title,
				slug {
					current
				},
				sku,
				image,
				price
			}`
  )) as {
    title: string;
    slug: {
      current: string;
    };
    sku: number;
    image: SanityImageSource;
    price: number;
  }[];

  const trendingProducts: ICollectionProduct[] = [];

  trendingProductsData.map((product) => {
    trendingProducts.push({
      title: product.title,
      slug: product.slug.current,
      sku: product.sku,
      image: {
        url: urlFor(product.image).url(),
      },
    });
  });

  // Get data for collections
  const collectionData = (await sanity.fetch(
    `*[_type == "categories"] | order(_createdAt desc)[0..2]{
				title,
				slug {
					current
				},
				image,
				description
			}`
  )) as {
    title: string;
    slug: {
      current: string;
    };
    image: SanityImageSource;
    description: string;
  }[];

  const collections: ICollectionCard[] = [];

  collectionData.map((collection) => {
    collections.push({
      catergory: collection.title,
      catergorySlug: collection.slug.current,
      image: {
        url: urlFor(collection.image).url(),
      },
      catergoryDescription: collection.description,
    });
  });

  return {
    props: {
      trendingProducts,
      collections,
    },
    revalidate: 10,
  };
};
