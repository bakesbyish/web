import { Layout } from '@components/layout/layout';
import { ShopProducts } from '@components/products/shop';
import { Meta } from '@components/seo/metatags';
import { IShopProducts, IShopDataStream } from '@interfaces/products';
import { sanity } from 'config/sanity';
import { GetStaticProps } from 'next';
import { ReactElement } from 'react';
import { SWRConfig } from 'swr';

const LIMIT = 20;

export default function Shop(props: {
  fallback: { products: IShopProducts[] };
}) {
  const { fallback } = props;

  return (
    <div className="flex flex-col items-center min-h-screen py-20">
      <Meta
        title={'Shop'}
        description={
          'Island wide delivery, for the finest and higest quality cake tools for the lowest possible price'
        }
      />

      <main className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 py-10">
        <SWRConfig value={{ fallback }}>
          <ShopProducts products={fallback.products} LIMIT={LIMIT} />
        </SWRConfig>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const products = (await sanity.fetch(
    `*[_type == "products"][0...${LIMIT}]{
				sku,
				title,
				"slug": slug.current,
				price,
				"url": image.asset -> url,
				"hasVariants": defined(count(productVariants[] -> title))
			}`
  )) as IShopProducts[];
  const totalProducts = await sanity.fetch(`count(*[_type == "products"])`);
  const hasNextPage = totalProducts > LIMIT ? true : false;
  const cursor = 2;

  return {
    props: {
      fallback: {
        products,
      },
    },
    revalidate: 10,
  };
};

Shop.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
