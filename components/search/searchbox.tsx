import { classNames } from '@lib/utils';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { SearchIcon } from '@heroicons/react/solid';

const SearchBox = (props: {
  currentRefinement: string;
  refine: Dispatch<SetStateAction<string>>;
}) => {
  const { currentRefinement, refine } = props;
  const [query, setQuery] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setQuery(value);
    refine(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    refine(query);
  };

  return (
    <form className="w-72 sm:w-96 sticky" onSubmit={handleSubmit}>
      <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">
        Search
      </label>
      <div className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <SearchIcon className="w-7 h-7 text-rose-400" />
        </div>
        <input
          type="search"
          className={classNames(
            'block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-pink-500 focus:border-pink-500',
            'dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
          )}
          placeholder={currentRefinement}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className={classNames(
            'text-black absolute right-2.5 bottom-2.5 bg-rose-400 hover:bg-rose-400 focus:ring-4 focus:outline-none focus:ring-rose-400',
            'font-medium rounded-lg text-sm px-4 py-2'
          )}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default connectSearchBox(SearchBox);
