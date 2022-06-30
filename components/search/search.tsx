import { InstantSearch } from 'react-instantsearch-dom';
import Hits from './hits';
import Searchbox from './searchbox';

export const Search = (props: any) => {
  const query = props.searchState?.query;

  return (
    <InstantSearch {...props}>
      <Searchbox
        defaultRefinement={query ? `${query}` : 'Search all products'}
      />
      <Hits />
    </InstantSearch>
  );
};
