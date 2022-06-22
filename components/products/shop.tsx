import { CogIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import { IShopProducts } from '@interfaces/products';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import useSWRInfinite from 'swr/infinite';

export const ShopProducts = (props: { products: IShopProducts[] }) => {
  // Define the fetcher function to fetch data
  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: 'GET',
    });

    return response.json();
  };

  // Define the key function to paginate the data fetched
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.hasNextPage) {
      return null;
    }

    if (pageIndex === 0) {
      return '/api/shop/get-products';
    }

    return `/api/shop/get-products?cursor=${previousPageData.cursor}`;
  };

  const { data, size, setSize } = useSWRInfinite(getKey, fetcher);

  // Paginate loading products to the initial server rendered products
  const [products, setProducts] = useState<IShopProducts[]>(props.products);

  const fetchMoreProducts = () => {
    setSize(size + 1);
    if (data) {
      data[size - 1] && setProducts(products.concat(data[size - 1].products));
    }
  };

  const { observe } = useInView({
    onChange: ({ observe }) => {
      observe();
    },
    onEnter: ({ unobserve }) => {
      unobserve();
      fetchMoreProducts();
    },
  });

  return (
    <>
      {products?.map((product, index: number) => (
        <article
          id={encodeURI(product.title)}
          key={index}
          ref={products.length - 1 ? observe : null}
          className="group"
        >
          <div className="w-full h-72 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <Link href={`/shop/${product.slug}`} passHref>
              <a>
                <Image
                  src={product.url}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-center object-cover group-hover:opacity-75"
                />
              </a>
            </Link>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <h3 className="mt-4 text-sm text-gray-700 dark:text-white">
                {product.title}
              </h3>
              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                {product.price}
              </p>
            </div>

            {product.hasVariants ? (
              <CogIcon className="w-6 h-6 mt-5" />
            ) : (
              <ShoppingCartIcon className="w-6 h-6 mt-5" />
            )}
          </div>
        </article>
      ))}

      <button onClick={fetchMoreProducts}>Load More</button>
    </>
  );
};
