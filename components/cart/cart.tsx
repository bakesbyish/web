import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { useCart } from 'react-use-cart';
import { useBakesbyIshcontext } from '@context/context';
import Link from 'next/link';
import Image from 'next/image';
import { ICart } from '@interfaces/products';
import { classNames } from '@lib/utils';
import * as fbq from '@lib/fbpixel';

export const Cart = () => {
  const { items, removeItem } = useCart() as unknown as {
    items: ICart[];
    removeItem: (item: string) => void;
  };
  const { cartOpen, setCartOpen } = useBakesbyIshcontext();

  return (
    <Transition.Root show={cartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setCartOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-800 shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          {' '}
                          Shopping cart{' '}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setCartOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {items.length ? (
                              <>
                                {items.map((item) => (
                                  <li key={item.id} className="flex py-6">
                                    <div
                                      style={{
                                        border: item.colorHex
                                          ? `solid ${item.colorHex}`
                                          : 'solid #e2e8f0',
                                      }}
                                      className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md"
                                    >
                                      <Link
                                        href={`/shop/${item.slug}`}
                                        passHref
                                      >
                                        <a onClick={() => setCartOpen(false)}>
                                          <Image
                                            src={item.url}
                                            alt={item.name}
                                            width={200}
                                            height={200}
                                            className="h-full w-full object-cover object-center"
                                          />
                                        </a>
                                      </Link>
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                          <h3>
                                            <Link href={`/shop/${item.slug}`}>
                                              <a>{item.name}</a>
                                            </Link>
                                          </h3>
                                          <p className="ml-4">
                                            {item.price.toLocaleString()}
                                          </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-white/80">
                                          {item.size ? item.size : null}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-white/80">
                                          {item.color ? item.color : null}
                                        </p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <p className="text-gray-500 dark:text-white/80">
                                          Qty {item.quantity}
                                        </p>

                                        <div className="flex">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              removeItem(item.id);
                                            }}
                                            className="font-medium text-rose-300 hover:text-rose-300"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </>
                            ) : (
                              <section className="flex flex-col items-center justify-center mt-16">
                                Your cart is empty
                              </section>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                        <p>Subtotal</p>
                        <p>
                          LKR{' '}
                          {(items.length
                            ? items.reduce(
                                (appended, current) =>
                                  appended +
                                  (current.itemTotal ? current.itemTotal : 0),
                                0
                              )
                            : 0
                          ).toLocaleString()}
                        </p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-white/80">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <Link href="/checkout">
                          <a
                            onClick={() => {
                              const itemsQty = items.length
                                ? items.reduce(
                                    (appended, current) =>
                                      appended +
                                      (current.quantity ? current.quantity : 0),
                                    0
                                  )
                                : 0;
                              console.log(itemsQty);
                              setCartOpen(false);
                              fbq.event('InitiateCheckout', {
                                currency: 'LKR',
                                value: items.length
                                  ? items.reduce(
                                      (appended, current) =>
                                        appended +
                                        (current.itemTotal
                                          ? current.itemTotal
                                          : 0),
                                      0
                                    )
                                  : 0,
                                content_ids: items.map((item) => item.sku),
                                contents: items.map((item) => item.name),
                                num_items: items.length
                                  ? items.reduce(
                                      (appended, current) =>
                                        appended +
                                        (current.quantity
                                          ? current.quantity
                                          : 0),
                                      0
                                    )
                                  : 0,
                              });
                            }}
                            href="#"
                            className={classNames(
                              'flex items-center justify-center rounded-md border border-transparent bg-rose-400 px-6 py-3',
                              'text-base font-medium text-black shadow-sm hover:bg-rose-400'
                            )}
                          >
                            Checkout
                          </a>
                        </Link>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="font-medium text-rose-300 hover:text-rose-400"
                            onClick={() => setCartOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
