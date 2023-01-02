import { ICollectionProduct } from '@interfaces/products';
import Image from 'next/image';
import Link from 'next/link';

export const Trending = (props: { trendingProducts: ICollectionProduct[] }) => {
  const { trendingProducts } = props;

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
					Best sellers
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {trendingProducts?.map((product) => (
						<Link href={`/shop/${product.slug}`} key={product.sku} passHref>
							<div className="group relative">
								<div className="w-full h-5/6 bg-gray-200 rounded-md overflow-hidden group-hover:opacity-75 lg:h-5/6">
										<Image
											src={product.image.url}
											alt={product.title}
											width={300}
											height={300}
											className="w-full h-full object-center object-cover lg:w-full lg:h-full"
										/>
								</div>
								<div className="mt-4 flex justify-between">
									<div>
										<h3 className="text-sm text-gray-700 dark:text-white/80">
											<span aria-hidden="true" className="absolute inset-0" />
											<Link href={`/shop/${product.slug}`}>
												{product.title}
											</Link>
										</h3>
									</div>
									<p className="text-sm font-medium text-gray-900 dark:text-white/80">
										{product.price}
									</p>
								</div>
							</div>
						</Link>
          ))}
        </div>
      </div>
    </div>
  );
};
