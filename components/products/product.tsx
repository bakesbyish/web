import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/solid';
import { RadioGroup } from '@headlessui/react';
import { ISlugProduct } from '@interfaces/products';
import { classNames } from '@lib/utils';
import Image from 'next/image';
import { Color } from '@components/utils/color';

export const Product = (props: { product: ISlugProduct }) => {
  const { product } = props;

  const [selectedVariant, setSelectedVariant] = useState(
    product.hasVariants ? product.productVariants[0] : null
  );
  const [selectedVariantColor, setSelectedVariantColor] = useState(
    selectedVariant ? selectedVariant.variantColors?.[0].color || null : null
  );
  const [selectedColor, setSelectedColor] = useState(
    product.hasColors ? product.productColors[0].color : null
  );

  return (
    <div>
      <div className="pt-6">
        {/* Image gallery */}
        <div className="mt-6 max-w-2xl mx-auto px-3 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-1">
          <div className="aspect-w-4 aspect-h-4 sm:rounded-lg sm:mx-auto sm:aspect-w-8 sm:aspect-h-4 sm:w-96 sm:h-96 lg:aspect-w-8 lg:aspect-h-2 lg:w-96 lg:h-96 justify-self-center">
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
              {selectedVariant?.price || product.price}
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

            <form className="mt-10">
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
                              'bg-white shadow-sm text-gray-900 cursor-pointer',
                              active ? 'ring-2 ring-rose-300' : '',
                              'group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6'
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

              <button
                type="submit"
                className="mt-10 w-full bg-rose-300 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-black hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400"
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
