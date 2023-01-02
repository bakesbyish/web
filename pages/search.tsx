import { Layout } from '@components/layout/layout';
import { GetServerSideProps } from 'next';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { findResultsState } from 'react-instantsearch-dom/server';
import { Search } from '@components/search/search';
import { useRouter } from 'next/router';
import algoliasearch from 'algoliasearch';
import qs from 'qs';
import { SearchSeo } from '@components/seo/search';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY
);

const UPDATE_AFTER = 700;

const DEFAULT_PROPS = {
  searchClient,
  indexName: 'allProducts',
};

const createURL = (state: any) => `?${qs.stringify(state)}`;

const pathToSearchState = (path: string) =>
  path.includes('?') ? qs.parse(path.substring(path.indexOf('?') + 1)) : {};

const searchStateToURL = (searchState: any) =>
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : ``;

export default function SearchPage(props: {
  resultsState: any;
  searchState: any;
}) {
  const [searchState, setSearchState] = useState(props.searchState);

  const router = useRouter();
  const debouncedSetState = useRef();

  useEffect(() => {
    if (router) {
      router.beforePopState((state: any): any => {
        const { url } = state;
        setSearchState(pathToSearchState(url));
      });
    }
  });

  return (
    <div className="felx flex-col items-center justify-center min-h-screen">
      <SearchSeo />
      <main className="flex flex-col items-center justify-center mt-10">
        <Search
          {...DEFAULT_PROPS}
          searchState={searchState}
          resultsState={props.resultsState}
          onSearchStateChange={(nextSearchState: any) => {
            clearTimeout(debouncedSetState.current);

            (debouncedSetState as any).current = setTimeout(() => {
              const href = searchStateToURL(nextSearchState);

              router.push(href, href, { shallow: true });
            }, UPDATE_AFTER);

            setSearchState(nextSearchState);
          }}
          createURL={createURL}
        />
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  resolvedUrl,
  res,
}) => {
  // Cache the result
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  const searchState = pathToSearchState(resolvedUrl);
  const resultState = await findResultsState(Search, {
    ...DEFAULT_PROPS,
    searchState,
  });

  return {
    props: {
      resultsState: JSON.parse(JSON.stringify(resultState)),
      searchState,
    },
  };
};

SearchPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
