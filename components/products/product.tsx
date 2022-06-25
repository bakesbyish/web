import { ChangeEvent, useEffect, useState } from 'react';
import { HeartIcon } from '@heroicons/react/solid';
import { RadioGroup } from '@headlessui/react';
import { ICart, IProduct } from '@interfaces/products';
import { classNames } from '@lib/utils';
import Image from 'next/image';
import { Color } from '@components/utils/color';
import { MinusIcon, PlusIcon } from '@heroicons/react/solid';
import { useCart } from 'react-use-cart';

export const Product = (props: { product: IProduct }) => {
  const { product } = props;

  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(
    product.hasVariants ? product.productVariants[0] : null
  );
  const [selectedVariantColor, setSelectedVariantColor] = useState(
    selectedVariant ? selectedVariant.variantColors?.[0].color || null : null
  );
  const [selectedColor, setSelectedColor] = useState(
    product.hasColors ? product.productColors[0].color : null
  );
  const [price, setPrice] = useState<number>(
    selectedVariant?.price || product.price
  );
  const [qty, setQty] = useState<number>(1);

  // Update the price when there are discounts for specific quantities
  useEffect(() => {
    if (selectedVariant) {
      if (selectedVariant.hasDiscounts) {
        setPrice(
          qty >= (selectedVariant as any).discountedFrom
            ? (selectedVariant.discountedPrice as number)
            : (selectedVariant.price as number)
        );
      } else if (product.hasDiscounts) {
        setPrice(
          qty >= (product as any).discountedFrom
            ? (product.discountedPrice as number)
            : (selectedVariant.price as number)
        );
      }
    } else if (product.hasDiscounts) {
      setPrice(
        qty >= (product as any).discountedFrom
          ? (product.discountedPrice as number)
          : (product.price as number)
      );
    }
  }, [qty, selectedVariant, product]);

  const handleQtyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);

    if (value > 0) {
      setQty(value);
    }
  };

  // Add the product to the cart when use clicks the cart button
  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedProduct = {
      id: product.sku,
			slug: product.slug,
      url: selectedVariant?.url || product.url,
      name: product.title,
      color: selectedVariantColor || selectedColor,
      size: selectedVariant?.name || null,
      price: price,
    } as ICart;

    addItem(selectedProduct, qty);
  };

  return (
    <div>
      <div className="pt-6">
        {/* Image gallery */}
        <div className="mt-6 max-w-2xl mx-auto px-3 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-1">
          <div
            className={classNames(
              'aspect-w-4 aspect-h-4 sm:rounded-lg sm:mx-auto sm:aspect-w-8 sm:aspect-h-4 sm:w-96 sm:h-96 lg:aspect-w-8 lg:aspect-h-2 lg:w-96 lg:h-96 justify-self-center'
            )}
          >
            <Image
              priority={true}
              src={props.product.url || product.url}
              alt={product.title}
              layout="fill"
              className="w-full h-full object-center object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {product.title}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:mt-0 lg:row-span-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900 dark:text-white">
              LKR {price}
            </p>

            {/* Hearts */}
            <div className="mt-6">
              <h3 className="sr-only">Hearts</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  <HeartIcon className="w-9 h-9 text-red-600" />
                </div>
                <span className="ml-3 text-sm font-medium text-rose-500 hover:text-rose-400">
                  {10} hearts
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-10">
              {/* Colors */}
              {selectedVariantColor && (
                <Color
                  value={selectedVariantColor}
                  setValue={setSelectedVariantColor}
                  colors={selectedVariant?.variantColors}
                />
              )}

              {selectedColor && (
                <Color
                  value={selectedColor}
                  setValue={setSelectedColor}
                  colors={product.productColors}
                />
              )}

              {/* variants */}
              {product.hasVariants ? (
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm text-gray-900 dark:text-white font-medium">
                      Select a variant
                    </h3>
                  </div>

                  <RadioGroup
                    value={selectedVariant}
                    onChange={setSelectedVariant}
                    className="mt-4"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a variant
                    </RadioGroup.Label>
                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                      {product.productVariants.map((variant) => (
                        <RadioGroup.Option
                          key={variant.name}
                          value={variant}
                          className={({ active }) =>
                            classNames(
                              'bg-white dark:bg-gray-700 dark:text-white shadow-sm text-gray-900 cursor-pointer',
                              active ? 'ring-2 ring-rose-300' : '',
                              'group relative border rounded-md py-4 px-4 flex items-center justify-center text-sm font-medium uppercase',
                              'hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-3'
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <RadioGroup.Label as="span">
                                {variant.name}
                              </RadioGroup.Label>
                              {true ? (
                                <span
                                  className={classNames(
                                    active ? 'border' : 'border-2',
                                    checked
                                      ? 'border-rose-300'
                                      : 'border-transparent',
                                    'absolute -inset-px rounded-md pointer-events-none'
                                  )}
                                  aria-hidden="true"
                                />
                              ) : (
                                <span
                                  aria-hidden="true"
                                  className="absolute -inset-px rounded-md border-2 border-gray-200 pointer-events-none"
                                >
                                  <svg
                                    className="absolute inset-0 w-full h-full text-gray-200 stroke-2"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    stroke="currentColor"
                                  >
                                    <line
                                      x1={0}
                                      y1={100}
                                      x2={100}
                                      y2={0}
                                      vectorEffect="non-scaling-stroke"
                                    />
                                  </svg>
                                </span>
                              )}
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              ) : null}

              <span className="sr-only">Choose the quantity</span>

              <section
                aria-hidden="true"
                className="mt-8 flex items-center justify-center gap-2"
              >
                <PlusIcon
                  type="button"
                  onClick={() => {
                    setQty(qty + 1);
                  }}
                  className="w-10 h-10 bg-slate-100 dark:bg-gray-700 py-2 rounded-lg"
                />
                <input
                  type="number"
                  min={1}
                  value={qty || ''}
                  onChange={handleQtyChange}
                  prefix="g"
                  className="text-center bg-slate-100 dark:bg-gray-700 py-2 w-32 rounded-lg"
                />
                {product.unit ? product.unit : null}
                <MinusIcon
                  onClick={() => {
                    setQty(qty > 1 ? qty - 1 : 1);
                  }}
                  className="w-10 h-10 bg-slate-100 dark:bg-gray-700 py-2 rounded-lg"
                />
              </section>

              <button
                type="submit"
                className={classNames(
                  'mt-10 w-full bg-rose-300 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-black hover:bg-rose-400',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400'
                )}
              >
                Add to bag
              </button>
            </form>
          </div>

          <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900 dark:text-white/80">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
