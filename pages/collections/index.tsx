import { Layout } from '@components/layout/layout';
import { DefaultSeo } from '@components/seo/default';
import { ICollection } from '@interfaces/collections';
import { classNames } from '@lib/utils';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanity, urlFor } from 'config/sanity';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement } from 'react';

export default function Collections(props: { catergories: ICollection[] }) {
  const { catergories } = props;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <DefaultSeo
        title={'Collections'}
        description={'Browse all categoriess in one convinent place'}
        paths={[
          {
            name: 'collections',
            url: '/collections',
          },
        ]}
        url={'/collections'}
      />
      <main className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto py-16 sm:py-24 lg:py-32 lg:max-w-none">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Collections
            </h2>

            <div className="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6">
              {catergories.map((catergory, index: number) => (
                <Link
                  href={`/collections/${catergory.catergorySlug}/1`}
                  passHref
                  key={index}
                >
                  <article className="group relative">
                    <div
                      className={classNames(
                        'relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2',
                        'sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1'
                      )}
                    >
                      <Image
                        src={catergory.image.url}
                        alt={catergory.catergory}
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <h3 className="mt-6 text-sm text-gray-500 dark:text-white/80">
                      <span className="absolute inset-0" />
                      {catergory.catergory}
                    </h3>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {catergory.catergoryDescription}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Get collections data
  const collectionsData = (await sanity.fetch(
    `*[_type == "categories"] | order(_createdAt asc){
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

  const collections: ICollection[] = [];

  collectionsData.map((collection) => {
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
    props: { catergories: collections },
    revalidate: 10,
  };
};

Collections.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
