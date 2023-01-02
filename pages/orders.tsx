import { Layout } from '@components/layout/layout';
import { Order } from '@components/orders/order';
import { DefaultSeo } from '@components/seo/default';
import { Loader } from '@components/utils/loader';
import { database, IOrder } from '@interfaces/firestore';
import { ISession } from '@interfaces/session';
import { postToJSON } from '@lib/firestore';
import { classNames } from '@lib/utils';
import { db } from 'config/firebase';
import { sessionOptions } from 'config/session';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
} from 'firebase/firestore';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

const LIMIT = 2;

export default function Orders(props: { uid: string }) {
  const { uid } = props;

  const ref = database.collections.orders;
  const ordersRef = collection(db, database.orders);
  const ordersQuery = query(
    ordersRef,
    where(ref.uid, '==', uid),
    where(ref.visible, '==', true),
    orderBy(ref.orderedAt, 'desc'),
    limit(LIMIT)
  );

  const [initialOrders, loading] = useCollectionDataOnce(ordersQuery);

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loadingMoreOrders, setLoadingMoreOrders] = useState<boolean>(false);
  const [hideLoadMoreOrders, setHideLoadMoreOrders] = useState<boolean>(true);

  useEffect(() => {
    if (initialOrders?.length) {
      const initialData = Array.from(new Set(initialOrders));
      initialData.length < LIMIT ? null : setHideLoadMoreOrders(false);

      setOrders((previousOrders) => [
        ...previousOrders,
        ...(initialData as IOrder[]),
      ]);
    }
  }, [initialOrders]);

  const getMoreOrders = async () => {
    if (!orders.length) {
      return;
    }

    setLoadingMoreOrders(true);

    const lastVisibleOrder = orders[orders.length - 1];
    const cursor =
      typeof lastVisibleOrder.orderedAt === 'number'
        ? Timestamp.fromMillis(lastVisibleOrder.orderedAt)
        : lastVisibleOrder.orderedAt;

    const moreOrdersQuery = query(
      ordersRef,
      where(ref.uid, '==', uid),
      where(ref.visible, '==', true),
      orderBy(ref.orderedAt, 'desc'),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newOrdersArray: IOrder[] = [];

    const ordersSnapshot = await getDocs(moreOrdersQuery);
    ordersSnapshot.docs.forEach((doc) => {
      const order = postToJSON(doc) as IOrder;

      if (!order.orderedAt) {
        return;
      }

      newOrdersArray.push(order);
    });

    const newOrders = Array.from(new Set(newOrdersArray));

    if (newOrders.length < LIMIT) {
      setHideLoadMoreOrders(true);
    }

    setOrders((previousOrders) => [...previousOrders, ...newOrders]);
    setLoadingMoreOrders(false);
  };

  return !loading ? (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <DefaultSeo title={'Your orders'} disableRobots={true} url={'/orders'} />
      {orders.length ? (
        <main className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl lg:text-4xl font-semibold leading-7 lg:leading-9 break-all">
            Previous orders
          </h1>

          {orders.map((order, index: number) => (
            <Order
              key={index}
              index={index}
              order={order}
              setOrders={setOrders}
            />
          ))}

          {!hideLoadMoreOrders ? (
            <button
              onClick={async () => await getMoreOrders()}
              disabled={loadingMoreOrders}
              className={classNames(
                'py-2 px-4 bg-rose-400 text-white font-semibold rounded-lg shadow-md hover:bg-rose-300',
                'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 w-56'
              )}
            >
              {loadingMoreOrders ? (
                <Loader width={6} height={6} />
              ) : (
                <span>Load more</span>
              )}
            </button>
          ) : null}
        </main>
      ) : (
        <section className="flex flex-col items-center justify-center">
          <h1 className="text-2xl mb-2 break-all">No orders</h1>
          <Link href="/shop">
            <a className="text-rose-400 underline">Continue shopping</a>
          </Link>
        </section>
      )}
    </div>
  ) : (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Loader />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
    // Cache
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    );

    const session = (req.session as ISession) || null;
    const uid = session?.uid || null;

    if (!(uid && session)) {
      return {
        redirect: {
          destination: '/register',
          permanent: false,
        },
      };
    }

    return {
      props: {
        uid,
      },
    };
  },
  sessionOptions
);

Orders.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
