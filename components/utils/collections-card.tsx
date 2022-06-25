import { ICollectionCard } from '@interfaces/products';
import Image from 'next/image';
import Link from 'next/link';

const callouts = [
  {
    name: 'Desk and Office',
    description: 'Work from home accessories',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/home-page-02-edition-01.jpg',
    imageAlt:
      'Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.',
    href: '#',
  },
  {
    name: 'Self-Improvement',
    description: 'Journals and note-taking',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/home-page-02-edition-02.jpg',
    imageAlt:
      'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
    href: '#',
  },
  {
    name: 'Travel',
    description: 'Daily commute essentials',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/home-page-02-edition-03.jpg',
    imageAlt: 'Collection of four insulated travel bottles on wooden shelf.',
    href: '#',
  },
];

export const Collections = (props: { collections: ICollectionCard[] }) => {
  const { collections } = props;

  return (
    <div className="bg-white dark:bg-gray-800 flex flex-col items-center justify-center -mt-16">
      <div className="w-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto py-16 sm:py-24 lg:py-32 lg:max-w-none">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            <Link href="/collections">Collections</Link>
          </h2>

          <div className="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6">
            {collections.map((catergory, index: number) => (
              <Link
                href={`/collections/${catergory.catergorySlug}`}
                key={index}
                passHref
              >
                <div className="group relative hover:cursor-pointer">
                  <div className="relative w-full h-80 bg-whit dark:bg-gray-800 rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
                    <Image
                      src={catergory.image.url}
                      alt={catergory.catergory}
                      width={800}
                      height={800}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <h3 className="mt-6 text-sm text-gray-500 dark:text-white">
                    <span className="absolute inset-0" />
                    {catergory.catergory}
                  </h3>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {catergory.catergoryDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Link href="/collections">
        <h1 className="text-center font-bold underline hover:cursor-pointer sm:-mt-16s">
          See all collections
        </h1>
      </Link>
    </div>
  );
};
