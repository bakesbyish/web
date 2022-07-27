import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon, LogoutIcon, XIcon } from '@heroicons/react/outline';
import { IUser } from '@interfaces/firestore';
import { logout } from '@lib/auth';
import { callsToAction, collections, profileDropDown } from '@lib/navbar-data';
import { classNames } from '@lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, MutableRefObject } from 'react';
import { KeyedMutator } from 'swr';
import { mobilePages } from '@lib/navbar-data';

export const CollectionsMenu = () => {
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={classNames(
              open
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-white/80',
              'group bg-white dark:bg-gray-700 rounded-md inline-flex items-center text-base font-medium',
              'hover:text-gray-900 dark:hover:text-white focus:outline-none'
            )}
          >
            <span>Collections</span>
            <ChevronDownIcon
              className={classNames(
                open
                  ? 'text-gray-600 dark:text-white'
                  : 'text-gray-400 dark:text-white/80',
                'ml-2 h-5 w-5 group-hover:text-gray-500 dark:group-hover:text-white'
              )}
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="relative grid gap-6 bg-white dark:bg-gray-700 px-5 py-6 sm:gap-8 sm:p-8">
                  {collections.map((item, index: number) => (
                    <a
                      key={index}
                      href={item.href}
                      onClick={() => close()}
                      className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <div className="ml-4">
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-white/80">
                          {item.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="px-5 py-5 bg-gray-50 dark:bg-gray-600 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
                  {callsToAction.map((item) => (
                    <div key={item.name} className="flow-root">
                      <Link href={item.href}>
                        <a
                          className={classNames(
                            '-m-3 p-3 flex items-center rounded-md text-base font-medium text-gray-900',
                            'dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
                          )}
                          onClick={() => close()}
                        >
                          <item.icon
                            className="flex-shrink-0 h-6 w-6 text-gray-400 dar:text-white/80"
                            aria-hidden="true"
                          />
                          <span className="ml-3">{item.name}</span>
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export const UserProfile = (props: {
  user: IUser;
  mutate: KeyedMutator<any>;
}) => {
  const { user, mutate } = props;

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={classNames(
              open
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-white/80',
              'group bg-white dark:bg-gray-700 rounded-md inline-flex items-center text-base font-medium',
              'hover:text-gray-900 dark:hover:text-white focus:outline-none'
            )}
          >
            <span>
              <Image
                src={user.photoURL}
                alt={user.displayName}
                width={50}
                height={50}
                className="rounded-full"
              />
            </span>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 -ml-4 mt-3 transform px-2 w-64 max-w-md sm:px-0 sm:-mr-8 sm:right-1/4 ">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="relative grid gap-6 bg-white dark:bg-gray-700 px-5 py-6 sm:gap-8 sm:p-8">
                  {profileDropDown.map((item, index) => (
                    <Link href={item.href} key={index}>
                      <a
                        onClick={() => close()}
                        className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <div className="ml-4">
                          <p className="text-base font-medium text-gray-900 dark:text-white flex gap-2">
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                          </p>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
                <div
                  onClick={async () => {
                    await logout();
                    mutate();
                  }}
                  className="px-5 py-5 bg-gray-50 dark:bg-gray-600 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8 group"
                >
                  <div className="flow-root group-hover:cursor-pointer">
                    <span
                      className={classNames(
                        '-m-3 p-3 flex items-center rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
                      )}
                    >
                      <LogoutIcon
                        className="flex-shrink-0 h-6 w-6 text-gray-400 dar:text-white/80"
                        aria-hidden="true"
                      />
                      <span className="ml-3">Logout</span>
                    </span>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export const MobileMenu = (props: {
  user: IUser | null;
  validating: boolean;
  mutate: KeyedMutator<any>;
  close: (
    focusableElement?:
      | HTMLElement
      | MutableRefObject<HTMLElement | null>
      | undefined
  ) => void;
}) => {
  const { user, validating, mutate, close } = props;

  return (
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
                  <a onClick={() => close()}>
                    <Image
                      className="h-8 w-auto"
                      src="/bakesbyish.svg"
                      alt="Bakes By Ish Logo"
                      width={40}
                      height={40}
                    />
                  </a>
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
                {mobilePages.map((item, index: number) => (
                  <Fragment key={index}>
                    {item.auth ? (
                      <>
                        {!validating ? (
                          <>
                            {user ? (
                              <a
                                key={index}
                                href={item.href}
                                onClick={() => close()}
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
                            ) : null}
                          </>
                        ) : null}
                      </>
                    ) : (
                      <a
                        key={index}
                        href={item.href}
                        onClick={() => close()}
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
                    )}
                  </Fragment>
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
                  onClick={() => close()}
                  className="text-base font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-white/80"
                >
                  {item.name}
                </a>
              ))}{' '}
            </div>
            <div>
              {!validating ? (
                user ? (
                  <>
                    <button
                      onClick={async () => {
                        close();
                        await logout();
                        mutate();
                      }}
                      className={classNames(
                        'w-full flex items-center gap-2 justify-center px-4 py-2 border border-transparent rounded-md',
                        'shadow-sm text-base font-medium text-slate-500 bg-rose-200 hover:bg-rose-400'
                      )}
                      aria-label="Logout"
                    >
                      <LogoutIcon
                        className="flex-shrink-0 h-6 w-6 text-gray-400 dar:text-white/80"
                        aria-hidden={true}
                      />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/register">
                      <a
                        onClick={() => close()}
                        className={classNames(
                          'w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md',
                          'shadow-sm text-base font-medium text-slate-500 bg-rose-400 hover:bg-rose-400'
                        )}
                      >
                        Sign up
                      </a>
                    </Link>
                    <p className="mt-6 text-center text-base font-medium text-gray-500 dark:text-white/80">
                      Existing customer?{' '}
                      <Link href="/login">
                        <a
                          onClick={() => close()}
                          className="text-rose-400 hover:text-rose-400"
                        >
                          Sign in
                        </a>
                      </Link>
                    </p>
                  </>
                )
              ) : null}
            </div>
          </div>
        </div>
      </Popover.Panel>
    </Transition>
  );
};
