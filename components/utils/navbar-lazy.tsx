import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { callsToAction, collections } from '@lib/navbar-data';
import { classNames } from '@lib/utils';
import { Fragment } from 'react';

export const CollectionsMenu = () => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              open
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-white/80',
              'group bg-white dark:bg-gray-700 rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 dark:hover:text-white focus:outline-none'
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
                      <a
                        href={item.href}
                        className="-m-3 p-3 flex items-center rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                      >
                        <item.icon
                          className="flex-shrink-0 h-6 w-6 text-gray-400 dar:text-white/80"
                          aria-hidden="true"
                        />
                        <span className="ml-3">{item.name}</span>
                      </a>
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
