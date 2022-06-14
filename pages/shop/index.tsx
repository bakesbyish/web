import { Layout } from '@components/layout/layout';
import { ShopProducts } from '@components/products/shop';
import { Meta } from '@components/seo/metatags';
import { IShopProducts } from '@interfaces/products';
import { GetStaticProps } from 'next';
import { ReactElement } from 'react';
import { SWRConfig } from 'swr';

export default function Shop(props: {
  fallback: { products: IShopProducts[] };
}) {
  const { fallback } = props;

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Meta
        title={'Shop'}
        description={
          'Island wide delivery, for the finest and higest quality cake tools for the lowest possible price'
        }
      />

      <main className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 py-10">
        <SWRConfig value={{ fallback }}>
          <ShopProducts products={fallback.products} />
        </SWRConfig>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch('http://localhost:3000/api/hello?count=10', {
    method: 'GET',
  });

  const products = await response.json();

  return {
    props: { fallback: { products } },
    revalidate: 10,
  };
};

Shop.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
