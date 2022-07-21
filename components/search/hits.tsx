import { Loader } from '@components/utils/loader';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { connectStateResults } from 'react-instantsearch-dom';

interface ISearchResults {
  hits: {
    title: string;
    slug: string;
    description: string;
    price: number;
    image: string;
    objectID: number;
  }[];
}

const Hits = (props: { searchState: any; searchResults: any }) => {
  const validQuery = props.searchState.query?.length >= 3 ? true : false;
  const searchResults = props.searchResults as ISearchResults;

  return searchResults?.hits.length && validQuery ? (
    <div className="bg-white dark:bg-gray-800">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Search results for{' '}
          <span className="text-rose-400 underline">
            {props.searchState.query}
          </span>
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {searchResults.hits.map((product) => (
            <Link
              key={product.objectID}
              href={`/shop/${product.slug}`}
              passHref
            >
              <article id={product.slug} className="group">
                <div className="w-full h-72 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <Link href={`/shop/${product.slug}`} passHref>
                    <a>
                      <Image
                        src={product.image}
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
                      LKR {product.price}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <>
      {validQuery ? (
        <div className="flex flex-col items-center justfiy-center mt-10">
          No results found
        </div>
      ) : null}
    </>
  );
};

export default connectStateResults(Hits);
