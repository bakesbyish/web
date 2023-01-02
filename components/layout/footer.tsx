import { Theme } from '@components/utils/theme';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="p-4 bg-slate-100 rounded-lg shadow md:px-6 md:py-8 dark:bg-gray-700">
      <div className="sm:flex sm:items-center sm:justify-between">
        <a
          href="https://bakesbyish.com"
          className="flex items-center mb-4 sm:mb-0"
        >
          <span className="self-center text-2xl whitespace-nowrap dark:text-white">
            Bakes By Ish
          </span>
        </a>
        <ul className="flex sm:flex-wrap sm:items-center justify-between mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6 ">
              About
            </a>
          </li>
          <li>
            <div className="">
              <Theme />
            </div>
          </li>
        </ul>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-slate-600 lg:my-8" />
      <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2022{' '}
        <a href="https://bakesbyish.com" className="hover:underline">
          bakesbyish
        </a>
        . All Rights Reserved.
      </span>
    </footer>
  );
};
