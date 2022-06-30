import { Loader } from '@components/utils/loader';
import Link from 'next/link';
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
					<span className="text-rose-400 underline">{props.searchState.query}</span>
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {searchResults.hits.map((product) => (
            <Link
              key={product.objectID}
              href={`/shop/${product.slug}`}
              passHref
            >
              <div className="group relative">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700 dark:text-white">
                      <a href={product.slug}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                      </a>
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <>
      {validQuery ? (
        <div className="flex flex-col items-center justfiy-center mt-10">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
          <p>No results found</p>
        </div>
      )}
    </>
  );
};

export default connectStateResults(Hits);
