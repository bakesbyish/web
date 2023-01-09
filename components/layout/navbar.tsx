import { UserProfile } from "@components/utils/navbar-lazy";
import { useBakesbyIshcontext } from "@context/context";
import { Popover } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import { classNames } from "@lib/utils";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const CollectionsMenu = dynamic<any>(() => import("@components/utils/navbar-lazy").then((mod) => mod.CollectionsMenu));

const CartIcon = dynamic<any>(
  () => import("@components/cart/navbar-cart").then((mod) => mod.Cart),
  { ssr: false },
);

const Cart = dynamic<any>(
  () => import("@components/cart/cart").then((mod) => mod.Cart),
  { ssr: false },
);

const MobileMenu = dynamic<any>(() => import("@components/utils/navbar-lazy").then((mod) => mod.MobileMenu));

export const Navbar = () => {
  const { user, validating, mutate } = useBakesbyIshcontext();

  return (
    <>
      <Cart />

      <Popover className="relative z-50 bg-white dark:bg-gray-700">
        {({ close }) => (
          <>
            <div className="px-4 mx-auto max-w-7xl sm:px-6">
              <div className="flex justify-between items-center py-6 border-b-2 border-gray-100 md:justify-start md:space-x-10 dark:border-gray-700">
                <div className="flex justify-start lg:flex-1 lg:w-0">
                  <span className="sr-only">Bakes By Ish</span>
                  <Link href="/" passHref>
                    <a>
                      <Image
                        className="w-auto h-8 sm:h-10"
                        src="/bakesbyish.svg"
                        alt="Bakes By Ish Logo"
                        width={50}
                        height={50}
                      />
                    </a>
                  </Link>
                </div>
                <div className="flex items-center -my-2 -mr-2 md:hidden justfiy-center">
                  <Link href="/search">
                    <SearchIcon className="z-auto mr-1 w-7 h-7 text-pink-600" />
                  </Link>

                  <CartIcon />

                  <Popover.Button
                    className={classNames(
                      "bg-white dark:bg-gray-700 rounded-md p-2 inline-flex items-center justify-center text-gray-400 dark:text-white/80 hover:text-gray-500",
                      "dark:hover:text-white hover:bg-gray-100",
                      "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500",
                    )}
                  >
                    <span className="sr-only">Open menu</span>
                    <MenuIcon className="w-8 h-8" aria-hidden="true" />
                  </Popover.Button>
                </div>
                <Popover.Group as="nav" className="hidden space-x-10 md:flex">
                  <Link href="/shop">
                    <a className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-white/80 dark:hover:text-white">
                      Shop
                    </a>
                  </Link>

                  <CollectionsMenu />
                </Popover.Group>
                <div className="hidden justify-end items-center md:flex md:flex-1 lg:w-0">
                  <Link href="/search">
                    <SearchIcon className="z-auto mr-2 w-7 h-7 text-pink-600 cursor-pointer" />
                  </Link>

                  <CartIcon />

                  {!validating
                    ? (
                      user ? <UserProfile user={user} mutate={mutate} /> : (
                        <>
                          <Link href="/login">
                            <a className="text-base font-medium text-gray-500 whitespace-nowrap hover:text-gray-900 dark:text-white/80 dark:hover:text-white">
                              Sign in
                            </a>
                          </Link>
                          <Link href="/register">
                            <a
                              className={classNames(
                                "ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent",
                                "rounded-md shadow-sm text-base font-medium text-slate-500 bg-rose-400 hover:bg-rose-400",
                              )}
                            >
                              Sign up
                            </a>
                          </Link>
                        </>
                      )
                    )
                    : null}
                </div>
              </div>
            </div>

            <MobileMenu
              user={user}
              validating={validating}
              mutate={mutate}
              close={close}
            />
          </>
        )}
      </Popover>
    </>
  );
};
