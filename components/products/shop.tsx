import { CogIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import { ICart, IShopProducts } from '@interfaces/products';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import toast from 'react-hot-toast';
import { useCart } from 'react-use-cart';
import useSWRInfinite from 'swr/infinite';
import * as fbq from '@lib/fbpixel';

export const ShopProducts = (props: {
  products: IShopProducts[];
  LIMIT: number;
}) => {
  const { LIMIT } = props;
  const { addItem } = useCart();

  const [end, setEnd] = useState<boolean>(false);

  // Define the fetcher function to fetch data
  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: 'GET',
    });

    return response.json();
  };

  // Define the key function to paginate the data fetched
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.products.length) {
      setEnd(true);
      return null;
    }

    if (pageIndex === 0) {
      return `/api/shop/get-products?page=1&limit=${LIMIT}`;
    }

    return `/api/shop/get-products?page=${pageIndex + 1}&limit=${LIMIT}`;
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
              <h3 className="mt-4 text-sm text-gray-700 dark:text-white w-56">
                {product.title}
              </h3>
              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                LKR {product.price.toLocaleString()}
              </p>
            </div>

            {product.hasVariants ? (
              <CogIcon className="w-6 h-6 mt-5" />
            ) : (
              <ShoppingCartIcon
                type="button"
                onClick={() => {
                  const selectedProduct = {
                    id: product.sku.toString(),
                    sku: product.sku,
                    slug: product.slug,
                    name: product.title,
                    url: product.url,
                    color: null,
                    size: null,
                    price: product.price,
                  } as ICart;

                  fbq.event('AddToCart', {
                    content_ids: selectedProduct.sku,
                    content_name: selectedProduct.name,
                    content_type: selectedProduct.size,
                    currency: 'LKR',
                    value: selectedProduct.price,
                  });

                  toast(`${product.title} added to cart`);
                  addItem(selectedProduct, 1);
                }}
                className="w-6 h-6 mt-5 cursor-pointer"
              />
            )}
          </div>
        </article>
      ))}

      {!end && <button onClick={fetchMoreProducts}>Load More</button>}
    </>
  );
};
