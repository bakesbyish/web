import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { ICollection } from '@interfaces/collections';
import { classNames } from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const CollectionPagination = (props: {
  page: string;
  totalPages: string;
  collections: ICollection;
}) => {
  const { collections } = props;
  const router = useRouter();

  useEffect(() => {
    const page = parseInt(props.page);
    const totalPages = parseInt(props.totalPages);

    if (page > 1) {
      const newPage = (page - 1).toString();
      router.prefetch(`/collections/${collections.catergorySlug}/${newPage}`);
    }

    if (page <= totalPages - 1) {
      const newPage = (page + 1).toString();
      router.prefetch(`/collections/${collections.catergorySlug}/${newPage}`);
    }
    // eslint-disable-next-line
  }, [props.page]);

  return (
    <div className="mt-16">
      <div className="flex-1 flex justify-between">
        <button
          onClick={() => {
            const page = parseInt(props.page);
            const newPage = (page - 1).toString();

            router.push(`/collections/${collections.catergorySlug}/${newPage}`);
          }}
          disabled={parseInt(props.page) === 1}
          className={classNames(
            'relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm',
            'font-medium rounded-md text-gray-700 dark:text-white/80 bg-white hover:bg-gray-50 dark:bg-gray-700 disabled:hidden'
          )}
        >
          Previous
        </button>
        <button
          onClick={() => {
            const page = parseInt(props.page);
            const newPage = (page + 1).toString();

            router.push(`/collections/${collections.catergorySlug}/${newPage}`);
          }}
          disabled={parseInt(props.page) === parseInt(props.totalPages)}
          className={classNames(
            'ml-3 relative inline-flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md',
            'text-gray-700 dark:text-white/80 bg-white dark:bg-gray-700 hover:bg-gray-50 disabled:hidden'
          )}
        >
          ⠀Next⠀
        </button>
      </div>
    </div>
  );
};
