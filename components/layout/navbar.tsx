import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import Link from 'next/link';
import { collections, pages } from '@lib/navbar-data';
import dynamic from 'next/dynamic';
import { classNames } from '@lib/utils';
import { Loader } from '@components/utils/loader';

const CollectionsMenu = dynamic<any>(() =>
  import('@components/utils/navbar-lazy').then((mod) => mod.CollectionsMenu)
);

const CartIcon = dynamic<any>(
  () => import('@components/cart/navbar-cart').then((mod) => mod.Cart),
  { ssr: false }
);

const Cart = dynamic<any>(
  () => import('@components/cart/cart').then((mod) => mod.Cart),
  { ssr: false }
);

export const Navbar = () => {
  return (
    <>
      <Cart />

      <Popover className="relative bg-white dark:bg-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center border-b-2 border-gray-100 dark:border-gray-700 py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <span className="sr-only">Bakes By Ish</span>
              <Link href="/" passHref>
                <>
                  <Image
                    className="h-8 w-auto sm:h-10"
                    src="/bakesbyish.svg"
                    alt="Bakes By Ish Logo"
                    width={40}
                    height={40}
                  />
                </>
              </Link>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <CartIcon />

              <Popover.Button
                className={classNames(
                  'bg-white dark:bg-gray-700 rounded-md p-2 inline-flex items-center justify-center text-gray-400 dark:text-white/80 hover:text-gray-500',
                  'dark:hover:text-white hover:bg-gray-100',
                  'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500'
                )}
              >
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-8 w-8" aria-hidden="true" />
              </Popover.Button>
            </div>
            <Popover.Group as="nav" className="hidden md:flex space-x-10">
              <Link href="/shop">
                <a className="text-base font-medium text-gray-500 dark:text-white/80 hover:text-gray-900 dark:hover:text-white">
                  Shop
                </a>
              </Link>

              <CollectionsMenu />
            </Popover.Group>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <CartIcon />

              <Link href="/login">
                <a className="whitespace-nowrap text-base font-medium text-gray-500 dark:text-white/80 hover:text-gray-900 dark:hover:text-white">
                  Sign in
                </a>
              </Link>
              <Link href="/register">
                <a
                  className={classNames(
                    'ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent',
                    'rounded-md shadow-sm text-base font-medium text-slate-500 bg-rose-200 hover:bg-rose-400'
                  )}
                >
                  Sign up
                </a>
              </Link>
            </div>
          </div>
        </div>

        <Transition
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
          >
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-700 divide-y-2 divide-gray-50">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Link href="/" passHref>
                      <>
                        <Image
                          className="h-8 w-auto"
                          src="/bakesbyish.svg"
                          alt="Bakes By Ish Logo"
                          width={40}
                          height={40}
                        />
                      </>
                    </Link>
                  </div>
                  <div className="-mr-2">
                    <Popover.Button
                      className={classNames(
                        'bg-white dark:bg-gray-700 rounded-md p-2 inline-flex items-center justify-center text-gray-400 dark:text-white/80',
                        'hover:text-gray-500 dark:hover:text-white hover:bg-gray-100',
                        'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500'
                      )}
                    >
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    {pages.map((item, index: number) => (
                      <a
                        key={index}
                        href={item.href}
                        className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <item.icon
                          className="flex-shrink-0 h-6 w-6 text-rose-400"
                          aria-hidden="true"
                        />
                        <span className="ml-3 text-base font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="py-6 px-5 space-y-6">
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {collections.map((item, index: number) => (
                    <a
                      key={index}
                      href={item.href}
                      className="text-base font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-white/80"
                    >
                      {item.name}
                    </a>
                  ))}{' '}
                </div>
                <div>
                  <Link href="/register">
                    <a
                      className={classNames(
                        'w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md',
                        'shadow-sm text-base font-medium text-slate-500 bg-rose-200 hover:bg-rose-400'
                      )}
                    >
                      Sign up
                    </a>
                  </Link>
                  <p className="mt-6 text-center text-base font-medium text-gray-500 dark:text-white/80">
                    Existing customer?{' '}
                    <Link href="/login">
                      <a className="text-rose-400 hover:text-rose-400">
                        Sign in
                      </a>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};
