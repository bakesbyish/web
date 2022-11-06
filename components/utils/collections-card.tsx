import { ICollectionCard } from '@interfaces/products';
import { classNames } from '@lib/utils';
import Image from 'next/image';
import Link from 'next/link';

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
                  <div
                    className={classNames(
                      'relative w-full h-80 bg-whit dark:bg-gray-800 rounded-lg overflow-hidden group-hover:opacity-75',
                      'sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1'
                    )}
                  >
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Link href="/collections">
        <a
          className={classNames(
            'relative inline-flex items-center justify-start py-3 pl-4 pr-12 -mt-8',
            'overflow-hidden font-semibold text-rose-400 transition-all duration-150 ease-in-out',
            'rounded hover:pl-10 hover:pr-6 bg-gray-50 group'
          )}
        >
          <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-rose-400 group-hover:h-full"></span>
          <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
            View all collections
          </span>
        </a>
      </Link>
    </div>
  );
};
