import { ICart } from '@interfaces/products';
import Image from 'next/image';
import Link from 'next/link';

export const Item = (props: { items: ICart[] }) => {
  const { items } = props;

  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full dark:bg-gray-900"
        >
          <div className="pb-4 md:pb-8 w-full md:w-40">
            <Link href={`/shop/${item.slug}`}>
              <a>
                <Image
                  src={item.url}
                  alt={item.name}
                  width={250}
                  height={250}
                  className="w-full hidden md:block rounded-md"
                />
              </a>
            </Link>
          </div>
          <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
            <div className="w-full flex flex-col justify-start items-start space-y-8">
              <Link href={`/${item.slug}`}>
                <a className="text-lg w-56 sm:text-lg font-semibold leading-6 text-gray-800 dark:text-white">
                  {item.name}
                </a>
              </Link>
              <div className="flex justify-start items-start flex-col space-y-2">
                {item.size ? (
                  <p className="text-sm leading-none text-gray-800 dark:text-slate-400">
                    <span className="text-black dark:text-white/80">
                      Size:{' '}
                    </span>{' '}
                    {item.size}
                  </p>
                ) : null}
                {item.color ? (
                  <p className="text-sm leading-none text-gray-800 dark:text-slate-400">
                    <span className="text-black/80 dark:text-white/80">
                      Color:{' '}
                    </span>{' '}
                    {item.color}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex justify-between space-x-8 items-start w-full ml-2">
              <p className="text-base dark:text-slate-300 xl:text-lg leading-6">
                LKR {item.price}
              </p>
              <p className="text-base xl:text-lg dark:text-slate-300 leading-6 text-gray-800">
                Qty {item.quantity}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
